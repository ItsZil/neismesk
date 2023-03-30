using Microsoft.AspNetCore.Mvc;
using neismesk.Utilities;
using neismesk.Models;
using neismesk.ViewModels.Ad;
using System.Data;

namespace neismesk.Controllers.Device
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

        [HttpPost("create")]
        public async Task<IActionResult> Create()
        {
            int userId = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);
            var form = await Request.ReadFormAsync();
            List<IFormFile> images = form.Files.GetFiles("images").ToList();
			//var images = form.Files["images"];
			//var images = Request.Form.Files;
			var name = form["name"].ToString();
            var description = form["description"].ToString();
            var category = Convert.ToInt32(form["fk_category"]);

            return Ok();
            try
            {
                DeviceModel device = new DeviceModel()
                {
                    Name = name,
                    Description = description,
                    Status = 1,
                    User = userId,
                    Category = category,
                    Images = images
                };
                
                device.Id = await _database.SaveDataGetId("INSERT INTO ads (name, description, fk_category, fk_user) VALUES (@name, @description, @fk_Category, @User, @Status)", "SELECT LAST_INSERT_ID()", device);
            	
                if (device.Id != null)
            	{
					bool success = false;
					//success = await _database.InsertImages(images, device.Id);
					return success == true ? Ok() : BadRequest();
            	}
            	else
            	{
            		return BadRequest();
            	}
            }
            catch (Exception ex)
            {
                return BadRequest();
            }

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
    }
}
