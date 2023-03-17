using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using neismesk.Utilities;
using neismesk.ViewModels.UserAuthentication;
using System.Text;

namespace neismesk.Controllers
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
            string sql = "SELECT password_hash, password_salt FROM users WHERE email = @email";
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
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
