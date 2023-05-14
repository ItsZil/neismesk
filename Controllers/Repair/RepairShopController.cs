using Microsoft.AspNetCore.Mvc;
using neismesk.Models;
using System.Data;
using neismesk.Repositories.RepairShop;

namespace neismesk.Controllers.Repair
{
    [ApiController]
    [Route("api/[controller]")]
    public class RepairShopController : Controller
    {
        private readonly RepairShopRepo _repairShopRepo;

        public RepairShopController()
        {
            _repairShopRepo = new RepairShopRepo();
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateRepairShop()
        {
            try
            {
                var form = await Request.ReadFormAsync();
                RepairShopModel repair_shop = new RepairShopModel()
                {
                    Name = form["name"].ToString(),
                    Phone_number = form["phone_number"].ToString(),
                    Email = form["email"].ToString(),
                    Address = form["address"].ToString(),
                    City = form["city"].ToString()
                };
                repair_shop.Id = await _repairShopRepo.Create(repair_shop);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }
    }
}
