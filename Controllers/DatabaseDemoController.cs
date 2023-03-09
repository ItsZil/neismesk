using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using neismesk.Utilities;
using System.Diagnostics;

namespace neismesk.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DatabaseDemoController : ControllerBase
    {
        private readonly DatabaseAccess _database;

        public DatabaseDemoController()
        {
            _database = new DatabaseAccess();
        }

        [HttpGet]
        public async Task<JsonResult> Get()
        {
            string sql = "SELECT courier_id, delivery_price FROM Courier";
            var dataTable = await _database.LoadData(sql);

            var couriers = new List<object>();
            foreach (DataRow row in dataTable.Rows)
            {
                couriers.Add(new
                {
                    courier_id = row.Field<int>("courier_id"),
                    delivery_price = row.Field<double>("delivery_price")
                });
            }
            return new JsonResult(couriers);
        }
    }
}
