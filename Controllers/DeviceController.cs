using Microsoft.AspNetCore.Mvc;
using neismesk.Controllers.UserAuthentication;
using neismesk.Utilities;
using neismesk.ViewModels;
using System.Data;

namespace neismesk.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeviceController : ControllerBase
    {
        private readonly DatabaseAccess _database;

        public DeviceController()
        {
            _database = new DatabaseAccess();
        }

        [HttpGet("getDevices")]
        public async Task<IActionResult> GetDevices()
        {

            try
            {
                var devices = await _database.LoadData("SELECT * FROM ads");

                if (devices == null)
                {
                    return BadRequest();
                }

                var result = (from DataRow dt in devices.Rows
                              select new DeviceViewModel()
                              {
                                  Id = Convert.ToInt32(dt["id"]),
                                  Name = dt["name"].ToString(),
                                  Description = dt["description"].ToString()
                              }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
