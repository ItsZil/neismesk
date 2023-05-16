using Microsoft.AspNetCore.Mvc;
using neismesk.Models;
using System.Data;
using neismesk.Repositories.RepairShop;
using neismesk.ViewModels.Repair;
using Microsoft.AspNetCore.Authorization;

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
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getRepairShops")]
        [Authorize]
        public async Task<IActionResult> GetRepairShops()
        {
            try
            {
                List<RepairShopViewModel> repair_shops = await _repairShopRepo.GetRepairShops();
                return Ok(repair_shops);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("changeApproval")]
        [Authorize]
        public async Task<IActionResult> ChangeApproval(RepairShopViewModel repairShop)
        {
            try
            {
                bool result = await _repairShopRepo.ChangeApproval(repairShop.Id, repairShop.Approved);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
