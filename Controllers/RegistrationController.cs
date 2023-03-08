using Microsoft.AspNetCore.Mvc;
using neismesk.ViewModels.UserAuthentication;
using neismesk.Utilities;
using Microsoft.AspNetCore.Cors;

namespace neismesk.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors("MyPolicy")]
    public class RegistrationController : ControllerBase
    {
        private readonly DatabaseAccess _database;

        public RegistrationController()
        {
            _database = new DatabaseAccess();
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegistrationViewModel registration)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Access-Control-Allow-Methods", "*");
            Response.Headers.Add("Access-Control-Allow-Credentials", "true");
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
