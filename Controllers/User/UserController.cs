using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using neismesk.Utilities;
using neismesk.Repositories.User;
using neismesk.ViewModels.UserAuthentication;
using System.Security.Claims;
using neismesk.ViewModels.User;
using System.Security.Cryptography;
using System.Web;
using MySqlX.XDevAPI.Common;

namespace neismesk.Controllers.UserAuthentication
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly UserRepo _userRepo;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
            _userRepo = new UserRepo();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginViewModel login)
        {
            // Retrieve the user's hashed password and salt, then compare it to the hashed plain text version.
            string sql = "SELECT user_id, name, surname, password_hash, password_salt, verification_token, user_role FROM users WHERE email = @email";
            var parameters = new { email = login.Email };
            var result = await _userRepo.LoadData(sql, parameters);

            if (result.Rows.Count == 0)
            {
                return StatusCode(404);
            }

            if(!String.Equals(result.Rows[0]["verification_token"].ToString(),""))
            {
                return StatusCode(401);
            }

            string hashed_password = result.Rows[0]["password_hash"].ToString();
            string password_salt = result.Rows[0]["password_salt"].ToString();

            bool match = false;
            try
            {
                match = PasswordHasher.doesPasswordMatch(login.Password, hashed_password, password_salt);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while comparing passwords: {ex}", ex);
                return StatusCode(404);
            }
           
            if (match)
            {
                // Authenticate the user.
                int userId = Convert.ToInt32(result.Rows[0]["user_id"]);
                string name = result.Rows[0]["name"].ToString();
                string surname = result.Rows[0]["surname"].ToString();
                int user_role = Convert.ToInt32(result.Rows[0]["user_role"]);

                var claims = new List<Claim>
                {
                    new Claim("user_id", userId.ToString()),
                    new Claim(ClaimTypes.Name, name),
                    new Claim(ClaimTypes.Surname, surname),
                    new Claim(ClaimTypes.Email, login.Email),
                    new Claim(ClaimTypes.Role, user_role.ToString())

                };
                var identity = new ClaimsIdentity(claims, "login");
                var principal = new ClaimsPrincipal(identity);
                await HttpContext.SignInAsync("Cookies", principal);

                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegistrationViewModel registration)
        {
            // Retrieve a hashed version of the user's plain text password.
            byte[] salt;
            string password_hash = PasswordHasher.hashPassword(registration.Password, out salt);
            string password_salt = Convert.ToBase64String(salt);

            byte[] tokenData = new byte[32]; // 256-bit token
            using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(tokenData);
            }

            string token = BitConverter.ToString(tokenData).Replace("-", ""); // Convert byte array to hex string

            bool success = await _userRepo.SaveData("INSERT INTO users (name, surname, email, password_hash, password_salt, verification_token) VALUES (@name, @surname, @email, @password_hash, @password_salt, @token)",
                    new { registration.Name, registration.Surname, registration.Email, password_hash, password_salt, token });

            if (success)
            {
                string verifyUrl;
                if (String.Equals(Environment.GetEnvironmentVariable("SERVER_HOST"), "1"))
                {
                    verifyUrl = $"https://neismesk.azurewebsites.net/verifyemail?email={HttpUtility.UrlEncode(registration.Email)}&token={HttpUtility.UrlEncode(token)}";
                }
                else
                {
                    verifyUrl = $"https://localhost:44486/verifyemail?email={HttpUtility.UrlEncode(registration.Email)}&token={HttpUtility.UrlEncode(token)}";
                }

                Emailer emailer = new Emailer();
                if (await emailer.verifyEmail(registration.Email, verifyUrl))
                {
                    return Ok();
                }
                else
                {
                    _logger.LogError("Failed to send email");
                    return StatusCode(401);
                }

            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("isLoggedIn/{requiredRole?}")]
        public IActionResult IsLoggedIn(int requiredRole = 0)
        {
            if (HttpContext.User.Identity.IsAuthenticated)
            {                
                int userId = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);
                int userRole = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.Role).Value);
                string userEmail = HttpContext.User.FindFirst(ClaimTypes.Email).Value;

                if (userRole >= requiredRole)
                {
                    _logger.LogInformation($"User #{userId} with email {userEmail} is logged in and is the required role.");
                    return Ok();
                }
                else
                {
                    _logger.LogInformation($"User #{userId} with email {userEmail} is logged in but is not the required role.");
                    return Unauthorized();
                }
            }
            else
            {
                _logger.LogInformation($"User is not logged in.");
                return Unauthorized();
            }
        }

        [HttpGet("getCurrentUserId")]
        public IActionResult GetCurrentUserId()
        {
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                int userId = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);
                return Ok(userId);
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpGet("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                int userId = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);

                HttpContext.SignOutAsync();
                _logger.LogInformation($"User #{userId} logged out.");
                return Ok();
            }
            else
            {
                _logger.LogError($"Failed to sign out. Something went wrong - [Authorize] passed, but user might not be logged in?");
                return Unauthorized();
            }
        }

        [HttpGet("getProfileDetails")]
        public async Task<IActionResult> GetProfileDetails()
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            
            int userId = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);

            string sql = "SELECT name, surname, email FROM users WHERE user_id = @user_id";
            var parameters = new { user_id = userId };
            var result = await _userRepo.LoadData(sql, parameters);

            if (result.Rows.Count == 0)
            {
                return BadRequest();
            }

            string name = result.Rows[0]["name"].ToString();
            string surname = result.Rows[0]["surname"].ToString();
            string email = result.Rows[0]["email"].ToString();

            // Grab the user's avatar if they have one.
            sql = "SELECT image FROM user_avatars WHERE fk_user = @user_id";
            parameters = new { user_id = userId };
            result = await _userRepo.LoadData(sql, parameters);
            byte[] avatar = null;

            if (result.Rows.Count > 0)
            {
                avatar = (byte[])result.Rows[0]["image"];
            }

            return Ok(new { name, surname, email, avatar });
        }

        [HttpPost("updateProfileDetails")]
        [Authorize]
        public async Task<IActionResult> UpdateProfileDetails()
        {
            var form = await Request.ReadFormAsync();
            string name = form["name"].ToString();
            string surname = form["surname"].ToString();
            string email = form["email"].ToString();
            string old_password = form["old_password"].ToString();
            string new_password = form["new_password"].ToString();
            IFormFile image = Request.Form.Files.GetFile("avatar");
            byte[] imageBytes = null;

            if (image != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    imageBytes = await ImageUtilities.ResizeCompressImage(image, 128, 128);
                }
            }

            int user_id = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);

            // Check if there already is a user with the same email.
            string sql = "SELECT user_id FROM users WHERE email = @email";
            var parameters_email = new { email };
            var result_email = await _userRepo.LoadData(sql, parameters_email);

            if (result_email.Rows.Count > 0)
            {
                int existingUserId = Convert.ToInt32(result_email.Rows[0]["user_id"]);
                if (existingUserId != user_id)
                {
                    return BadRequest("Šis el. paštas užimtas!");
                }
            }

            // Retrieve the user's hashed password and salt, then compare it to the new hashed plain text version.
            sql = "SELECT password_hash, password_salt FROM users WHERE user_id = @user_id";
            var parameters_password = new { user_id };
            var result_password = await _userRepo.LoadData(sql, parameters_password);

            string hashed_password = result_password.Rows[0]["password_hash"].ToString();
            string password_salt = result_password.Rows[0]["password_salt"].ToString();

            bool match = false;
            try
            {
                match = PasswordHasher.doesPasswordMatch(old_password, hashed_password, password_salt);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while comparing passwords during profile update: {ex}", ex);
                return StatusCode(500);
            }

            if (match)
            {
                byte[] salt;
                string password_hash = PasswordHasher.hashPassword(new_password, out salt);
                password_salt = Convert.ToBase64String(salt);

                sql = "UPDATE users SET name = @name, surname = @surname, email = @email, password_hash = @password_hash, password_salt = @password_salt WHERE user_id = @user_id";
                var parameters_update = new { name, surname, email, password_hash, password_salt, user_id };
                await _userRepo.SaveData(sql, parameters_update);
            }
            else if (old_password == "" && new_password == "")
            {
                sql = "UPDATE users SET name = @name, surname = @surname, email = @email WHERE user_id = @user_id";
                var parameters_update = new { name, surname, email, user_id };
                await _userRepo.SaveData(sql, parameters_update);
            }
            else
            {
                return BadRequest("Neteisingas slaptažodis!");
            }
            
            // Update the user's avatar.
            if (image != null)
            {
                sql = "SELECT id FROM user_avatars WHERE fk_user = @user_id";
                var parameters_avatar = new { user_id };
                var result_avatar = await _userRepo.LoadData(sql, parameters_avatar);
                if (result_avatar.Rows.Count > 0)
                {
                    sql = "UPDATE user_avatars SET image = @avatar WHERE fk_user = @user_id";
                    var parameters_update_avatar = new { avatar = imageBytes, user_id };
                    await _userRepo.SaveData(sql, parameters_update_avatar);
                }
                else
                {
                    sql = "INSERT INTO user_avatars (image, fk_user) VALUES (@avatar, @user_id)";
                    var parameters_insert_avatar = new { avatar = imageBytes, user_id };
                    await _userRepo.SaveData(sql, parameters_insert_avatar);
                }
            }
            return Ok();
        }

        [HttpGet("getUserAvatar")]
        public async Task<IActionResult> GetUserAvatar()
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                // Return Ok because we don't want an error to show up in the console.
                // This method for now is only used in the NavMenu, which can be called when the user is not logged in.
                return Ok("./images/profile.png");
            }
            int user_id = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);

            string sql = "SELECT image FROM user_avatars WHERE fk_user = @user_id";
            var parameters = new { user_id };
            var result = await _userRepo.LoadData(sql, parameters);

            if (result.Rows.Count == 0)
            {
                return Ok("./images/profile.png");
            }
            byte[] avatar = (byte[])result.Rows[0]["image"];
            return Ok(new { user_id, avatar });
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail(EmailVerificationViewModel emailVerify)
        {
            string sql = "SELECT verification_token FROM users WHERE email = @email AND verification_token = @token";
            var parameters = new { email = emailVerify.Email, token = emailVerify.Token };
            var result = await _userRepo.LoadData(sql, parameters);

            if (result.Rows.Count == 0)
            {
                return StatusCode(404);
            }
            else
            {
                bool success = await _userRepo.SaveData("UPDATE users SET verification_token = NULL WHERE email = @email AND  verification_token = @token",
                    new { email = emailVerify.Email, token = emailVerify.Token });
                if (success)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(PasswordResetRequestViewModel resetRequest)
        {
            // Retrieve the user's hashed password and salt, then compare it to the hashed plain text version.
            string sql = "SELECT email FROM users WHERE email = @email";
            var parameters = new { email = resetRequest.Email };
            var result = await _userRepo.LoadData(sql, parameters);

            if (result.Rows.Count == 0)
            {
                return StatusCode(404);
            }
            else
            {
                byte[] tokenData = new byte[32]; // 256-bit token
                using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider())
                {
                    rng.GetBytes(tokenData);
                }

                string token = BitConverter.ToString(tokenData).Replace("-", ""); // Convert byte array to hex string
                DateTime changeTimer = DateTime.Now;
                changeTimer = changeTimer.AddHours(1);
                string time = changeTimer.ToString("yyyy-MM-dd HH:mm:ss.fff");

                bool success = await _userRepo.SaveData("UPDATE users SET password_change_token = @token, password_change_time = @time WHERE email = @email",
                                new { token, time, resetRequest.Email });

                if (!success) { return BadRequest(); }

                string resetUrl;
                if (String.Equals(Environment.GetEnvironmentVariable("SERVER_HOST"), "1"))
                {
                    resetUrl = $"https://neismesk.azurewebsites.net/changepassword?email={HttpUtility.UrlEncode(resetRequest.Email)}&token={HttpUtility.UrlEncode(token)}";
                }
                else
                {
                    resetUrl = $"https://localhost:44486/changepassword?email={HttpUtility.UrlEncode(resetRequest.Email)}&token={HttpUtility.UrlEncode(token)}";
                } 

                Emailer emailer = new Emailer();
                if (await emailer.changePassword(result, resetUrl))
                {
                    return Ok();
                }
                else
                {
                    _logger.LogError("Failed to send email");
                    return StatusCode(401);
                }    
            }
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(PasswordChangeViewModel passwordChange)
        {
            // Retrieve the user's hashed password and salt, then compare it to the hashed plain text version.
            string sql = "SELECT password_change_token, password_change_time FROM users WHERE email = @email AND password_change_token = @token";
            var parameters = new {email = passwordChange.Email, token = passwordChange.Token };
            var result = await _userRepo.LoadData(sql, parameters);

            if (result.Rows.Count == 0)
            {
                return StatusCode(401);
            }
            else
            {
                DateTime timer = DateTime.Parse(result.Rows[0]["password_change_time"].ToString());

                if (timer > DateTime.Now)
                {
                    byte[] salt;
                    string password_hash = PasswordHasher.hashPassword(passwordChange.Password, out salt);
                    string password_salt = Convert.ToBase64String(salt);

                    bool success = await _userRepo.SaveData("UPDATE users SET password_hash = @password_hash, password_salt = @password_salt, password_change_token = NULL, password_change_time = NULL WHERE password_change_token = @token",
                    new { password_hash, password_salt, token = passwordChange.Token });

                    if (success)
                    {
                        return Ok();
                    }
                    else
                    {
                        return BadRequest();
                    }
                }
                else
                {
                    return StatusCode(300);
                }

            }
        }
    }
}
