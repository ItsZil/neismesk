using Microsoft.AspNetCore.Mvc;
using neismesk.Utilities;
using neismesk.ViewModels.Ad;
using neismesk.Models;
using System.Data;
using neismesk.Response;
using System.Web.Http.Results;

namespace neismesk.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[EnableCors("MyPolicy")]
    public class DeviceController : ControllerBase
    {
        private readonly DatabaseAccess _database;

        public DeviceController()
        {
            _database = new DatabaseAccess();
        }

        // TODO: make proper response
        [HttpPost("create")]
        public async Task<IActionResult> Create()
        {
            var files = Request.Form.Files;
            return Ok();
            //try
            //{
            //    bool success = await _database.SaveData("INSERT INTO ads (name, description, category, fk_category, fk_user) VALUES (@name, @description, @category, @fk_Category, @fk_User)", ad);
			//	if (success)
			//	{
			//		return Ok();
			//	}
			//	else
			//	{
			//		return BadRequest();
			//	}
			//}
            //catch (Exception ex)
            //{
            //    return BadRequest();
			//}
            
        }

        [HttpGet("getCategories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _database.LoadData("SELECT * FROM categories");
                CategoryModel categoryViewModel = new CategoryModel();
                var categoryModel = (from DataRow dt in categories.Rows
                                     select new CategoryViewModel()
                                     {
                                         Id = Convert.ToInt32(dt["category_id"]),
                                         Name = dt["category_name"].ToString()
                                     }).ToList();

                
                return categories == null ? BadRequest() : Ok(categoryModel);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
