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
        [HttpDelete("delete/{id}")]
public async Task<IActionResult> DeleteItem(int id)
{
    try
    {
        // Check if item exists
        var item = await _database.LoadData($"SELECT * FROM ads WHERE id={id}");
        if (item == null || item.Rows.Count == 0)
        {
            return BadRequest();
        }

        // Delete item from database
        await _database.SaveData($"DELETE FROM ads WHERE id={id}", id);

        return Ok();
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}
    }
}
