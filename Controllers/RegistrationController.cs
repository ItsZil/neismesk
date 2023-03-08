using Microsoft.AspNetCore.Mvc;
using neismesk.ViewModels.UserAuthentication;
using neismesk.Utilities;
using Microsoft.AspNetCore.Cors;

namespace neismesk.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors("AllowAnyOrigin")]
    public class RegistrationController : ControllerBase
    {
        private readonly DatabaseAccess _database;

        public RegistrationController()
        {
            _database = new DatabaseAccess();
        }

        [HttpGet]
        public async Task<IActionResult> Register([FromBody] RegistrationViewModel registration)
        {
            Response.Headers.Add("Access-Control-Allow-Origins", "*");
            Response.Headers.Add("Access-Control-Allow-Methods", "*");

            bool success = await _database.SaveData("INSERT INTO User (name, surname, email, encrypted_password) VALUES (@name, @surname, @email, @password)", registration);

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
