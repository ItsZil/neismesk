using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using neismesk.Utilities;
using neismesk.ViewModels.UserAuthentication;
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

        [HttpGet("protected")]
        [Authorize]
        public IActionResult Protected()
        {
            var userIdClaim = HttpContext.User.FindFirst("UserId");
            // Set the user id to UserId clain
            if (userIdClaim != null)
            {
                int userId = Convert.ToInt32(userIdClaim.Value);
                string userEmail = HttpContext.User.FindFirst(ClaimTypes.Email).Value;
                _logger.LogInformation($"User {userId} with email  {userEmail} accessed protected resource");
                return Ok();
            }
            else
            {
                _logger.LogInformation($"User attempted to access protected resource");
                return Unauthorized();
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginViewModel login)
        {
            // Retrieve the user's hashed password and salt, then compare it to the hashed plain text version.
            string sql = "SELECT * FROM users WHERE email = @email";
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

            if (PasswordHasher.doesPasswordMatch(login.Password, hashed_password, password_salt))
            {
                int userId = Convert.ToInt32(result.Rows[0]["user_id"]);
                string user_role = Convert.ToString(result.Rows[0]["user_role"]);

                var claims = new List<Claim>
                {
                    new Claim("UserId", userId.ToString()),
                    new Claim(ClaimTypes.Role, user_role),
                    new Claim(ClaimTypes.Email, login.Email)
                };
                var identity = new ClaimsIdentity(claims, "login");
                var principal = new ClaimsPrincipal(identity);
                await HttpContext.SignInAsync("Cookies", principal);

                return Ok();
            }
            else
            {
                return StatusCode(500);
            }
        }
    }
}
