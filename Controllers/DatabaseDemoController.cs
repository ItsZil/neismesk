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
        private readonly DatabaseAccess _dataAccess;

        public DatabaseDemoController()
        {
            string connectionString = Environment.GetEnvironmentVariable("DATABASE_CONN_STRING");
            _dataAccess = new DatabaseAccess(connectionString);
        }

        [HttpGet]
        public async Task<JsonResult> Get()
        {
            string sql = "SELECT courier_id, delivery_price FROM Courier";
            var dataTable = await _dataAccess.LoadData(sql);

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
