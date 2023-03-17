using Microsoft.AspNetCore.Mvc;
using neismesk.ViewModels.UserAuthentication;
using neismesk.Utilities;

namespace neismesk.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController : ControllerBase
    {
        private readonly ILogger<RegistrationController> _logger;
        private readonly DatabaseAccess _database;

        public RegistrationController(ILogger<RegistrationController> logger)
        {
            _logger = logger;
            _database = new DatabaseAccess();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegistrationViewModel registration)
        {
            // Retrieve a hashed version of the user's plain text password.
            byte[] salt;
            string password_hash = PasswordHasher.hashPassword(registration.Password, out salt);
            string password_salt = Convert.ToBase64String(salt);

            bool success = await _database.SaveData("INSERT INTO User (name, surname, email, password_hash, password_salt) VALUES (@name, @surname, @email, @password_hash, @password_salt)",
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
    }
}
