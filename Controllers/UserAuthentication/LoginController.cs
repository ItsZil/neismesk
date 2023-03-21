using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using neismesk.Utilities;
using neismesk.ViewModels.UserAuthentication;
using System.Linq.Expressions;
using System.Security.Claims;

namespace neismesk.Controllers.UserAuthentication
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILogger<LoginController> _logger;
        private readonly DatabaseAccess _database;

        public LoginController(ILogger<LoginController> logger)
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

            _logger.LogInformation("Hashed password is {hashed_password}", hashed_password);
            _logger.LogInformation("Password salt is {password_salt}", password_salt);

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
                string user_role = Convert.ToString(result.Rows[0]["user_role"]);

                var claims = new List<Claim>
                {
                    new Claim("user_id", userId.ToString()),
                    new Claim(ClaimTypes.Name, name),
                    new Claim(ClaimTypes.Surname, surname),
                    new Claim(ClaimTypes.Email, login.Email),
                    new Claim(ClaimTypes.Role, user_role)

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

        [HttpGet("isloggedin")]
        public IActionResult IsLoggedIn()
        {
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                var userIdClaim = HttpContext.User.FindFirst("user_id");
                int userId = Convert.ToInt32(userIdClaim.Value);
                string userEmail = HttpContext.User.FindFirst(ClaimTypes.Email).Value;
                _logger.LogInformation($"User #{userId} with email {userEmail} is logged in.");
                return Ok();
            }
            else
            {
                _logger.LogInformation($"User is not logged in.");
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
    }
}
