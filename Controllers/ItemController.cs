using Microsoft.AspNetCore.Mvc;
using neismesk.Utilities;
using neismesk.ViewModels;
using System.Data;

namespace neismesk.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly DatabaseAccess _database;

        public ItemController()
        {
            _database = new DatabaseAccess();
        }

        [HttpGet("getItems")]
        public async Task<IActionResult> GetItems()
        {
            try
            {
                var items = await _database.LoadData("SELECT * FROM ads");
                if (items == null)
                {
                    return BadRequest();
                }
                var result = (from DataRow dt in items.Rows
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
