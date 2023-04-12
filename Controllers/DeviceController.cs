using Microsoft.AspNetCore.Mvc;
using neismesk.Controllers.UserAuthentication;
using neismesk.Utilities;
using neismesk.ViewModels.Ad;
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
 [HttpGet("getCategories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _database.LoadData("SELECT * FROM categories");

                if (categories == null)
                {
                    return BadRequest();
                }

                var result = (from DataRow dt in categories.Rows
                                     select new CategoryViewModel()
                                     {
                                         Id = Convert.ToInt32(dt["category_id"]),
                                         Name = dt["category_name"].ToString()
                                     }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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
         [HttpGet("getDevices/{id}")]
public async Task<IActionResult> GetDevice(int id)
{
    try
    {
        var device = await _database.LoadData($"SELECT * FROM ads WHERE id={id}");

        if (device == null || device.Rows.Count == 0)
        {
            return BadRequest();
        }

        var result = new DeviceViewModel()
        {
            Id = Convert.ToInt32(device.Rows[0]["id"]),
            Name = device.Rows[0]["name"].ToString(),
            Description = device.Rows[0]["description"].ToString()
        };

        return Ok(result);
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}
[HttpPut("update/{id}")]
public async Task<IActionResult> UpdateDevice(int id, DeviceViewModel model)
{
    try
    {
        // Check if device exists
        var device = await _database.LoadData($"SELECT * FROM ads WHERE id={id}");
        if (device == null || device.Rows.Count == 0)
        {
            return BadRequest();
        }
        // Update device in database
        await _database.SaveData($"UPDATE ads SET name=@name, description=@description WHERE id={id}", 
                          new { model.Name, model.Description });

        return Ok();
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}
    }
}
