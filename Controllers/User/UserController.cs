using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using neismesk.Utilities;
using neismesk.ViewModels.UserAuthentication;
using System.IO;
using System.Security.Claims;

namespace neismesk.Controllers.UserAuthentication
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly DatabaseAccess _database;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
            _database = new DatabaseAccess();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginViewModel login)
        {
            // Retrieve the user's hashed password and salt, then compare it to the hashed plain text version.
            string sql = "SELECT user_id, name, surname, password_hash, password_salt, user_role FROM users WHERE email = @email";
            var parameters = new { email = login.Email };
            var result = await _database.LoadData(sql, parameters);

            if (result.Rows.Count == 0)
            {
                return BadRequest();
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
                return StatusCode(500);
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

            bool success = await _database.SaveData("INSERT INTO users (name, surname, email, password_hash, password_salt) VALUES (@name, @surname, @email, @password_hash, @password_salt)",
                    new { registration.Name, registration.Surname, registration.Email, password_hash, password_salt });

            if (success)
            {
                return Ok();
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
                    await image.CopyToAsync(memoryStream);
                    imageBytes = memoryStream.ToArray();
                }
            }

            return Ok();
        }
    }
}
