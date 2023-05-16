using MySql.Data.MySqlClient;
using neismesk.Models;
using neismesk.ViewModels.Repair;
using Serilog;
using System.Data;
using System.Data.Common;

namespace neismesk.Repositories.RepairShop
{
    public class RepairShopRepo
    {
        private Serilog.ILogger _logger;
        private readonly string _connectionString;

        public RepairShopRepo()
        {
            CreateLogger();

            _connectionString = Environment.GetEnvironmentVariable("DATABASE_CONN_STRING");
        }
         private void CreateLogger()
        {
            _logger = new LoggerConfiguration()
                .WriteTo.Console()
                .CreateLogger();
        }
          private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_connectionString);
        }

        public async Task<int> Create(RepairShopModel repairShop)
        {
            using MySqlConnection connection = GetConnection();
            await connection.OpenAsync();

            using MySqlCommand command = new MySqlCommand(
                "INSERT INTO repair_shop (name, phone_number, email, address, city) " +
                "VALUES (@Name, @Phone_number, @Email, @Address, @City)", connection);

            command.Parameters.AddWithValue("@Name", repairShop.Name);
            command.Parameters.AddWithValue("@Phone_number", repairShop.Phone_number);
            command.Parameters.AddWithValue("@Email", repairShop.Email);
            command.Parameters.AddWithValue("@Address", repairShop.Address);
            command.Parameters.AddWithValue("@City", repairShop.City);

            await command.ExecuteNonQueryAsync();

            command.CommandText = "SELECT LAST_INSERT_ID()";
            int id = Convert.ToInt32(await command.ExecuteScalarAsync());

            return id;
        }

        public async Task<List<RepairShopModel>> GetRepairShops()
        {
            using MySqlConnection connection = GetConnection();
            await connection.OpenAsync();

            using MySqlCommand command = new MySqlCommand(
                "SELECT * FROM repair_shop", connection);

            List<RepairShopModel> repairShops = new List<RepairShopModel>();
            using (DbDataReader reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    RepairShopModel repairShop = new RepairShopModel()
                    {
                        Id = Convert.ToInt32(reader["id"]),
                        Name = Convert.ToString(reader["name"]),
                        Phone_number = Convert.ToString(reader["phone_number"]),
                        Email = Convert.ToString(reader["email"]),
                        Address = Convert.ToString(reader["address"]),
                        City = Convert.ToString(reader["city"]),
                        Approved = Convert.ToBoolean(reader["approved"])
                    };
                    repairShops.Add(repairShop);
                }
            }
            return repairShops;
        }
    }
}