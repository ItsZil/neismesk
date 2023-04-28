using MySql.Data.MySqlClient;
using neismesk.Models;
using neismesk.Utilities;
using neismesk.ViewModels.Item;
using Serilog;
using System.Data;

namespace neismesk.Repositories
{
    public class ItemRepo
    {
        private Serilog.ILogger _logger;
        private readonly string _connectionString;

        public ItemRepo()
        {
            CreateLogger();

            _connectionString = Environment.GetEnvironmentVariable("DATABASE_CONN_STRING");
        }

        public ItemRepo(string connectionString)
        {
            CreateLogger();

            _connectionString = connectionString;
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

        //public async Task<List<ItemTypeViewModel>> GetAll()
        //{
        //    List<ItemTypeViewModel> types = new List<ItemTypeViewModel>();
        //
        //    try
        //    {
        //        using (var connection = new MySqlConnection(_connectionString))
        //        {
        //            using (var command = new MySqlCommand("SELECT * FROM ad_type", connection))
        //            {
        //                await connection.OpenAsync();
        //                var dataTable = new DataTable();
        //                using (var dataAdapter = new MySqlDataAdapter(command))
        //                {
        //                    dataAdapter.Fill(dataTable);
        //                }
        //
        //                types = (from DataRow dt in dataTable.Rows
        //                         select new ItemTypeViewModel()
        //                         {
        //                             Id = Convert.ToInt32(dt["id"]),
        //                             Name = dt["type"].ToString()
        //                         }).ToList();
        //
        //                return types;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.Error(ex, "Error loading data from database!");
        //        return types;
        //    }
        //}

        public async Task<int> Create(ItemModel item)
        {
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using MySqlCommand command = new MySqlCommand(
                    "INSERT INTO ads (name, description, location, fk_category, fk_user, fk_status, fk_type, end_datetime) " +
                    "VALUES (@Name, @Description, @Location, @Category, @User, @Status, @Type, @EndDate)", connection);

                command.Parameters.AddWithValue("@Name", item.Name);
                command.Parameters.AddWithValue("@Description", item.Description);
                command.Parameters.AddWithValue("@Location", item.Location);
                command.Parameters.AddWithValue("@Category", item.Category);
                command.Parameters.AddWithValue("@User", item.User);
                command.Parameters.AddWithValue("@Status", item.Status);
                command.Parameters.AddWithValue("@Type", item.Type);
                command.Parameters.AddWithValue("@EndDate", item.EndDate);

                await command.ExecuteNonQueryAsync();

                command.CommandText = "SELECT LAST_INSERT_ID()";
                int id = Convert.ToInt32(await command.ExecuteScalarAsync());

                return id;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error saving data to database!");
                return -1;
            }
        }

        public async Task<ItemViewModel> Find(int id)
        {
            ItemViewModel item = new ItemViewModel();

            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    using (var command = new MySqlCommand($"SELECT * FROM ads WHERE id={id}", connection))
                    {
                        await connection.OpenAsync();
                        var dataTable = new DataTable();
                        using (var dataAdapter = new MySqlDataAdapter(command))
                        {
                            dataAdapter.Fill(dataTable);
                        }

                        item = (from DataRow dt in dataTable.Rows
                                select new ItemViewModel()
                                {
                                    Id = Convert.ToInt32(dt["id"]),
                                    Name = dt["type"].ToString()
                                }).FirstOrDefault();

                        return item;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error loading data from database!");
                return item;
            }
        }

        public async Task<bool> Update(ItemModel item)
        {
            try
            {
                using MySqlConnection connection = GetConnection();
                using MySqlCommand command = new MySqlCommand(
                    "UPDATE ads SET name=@Name, description=@Description, fk_category=@Category WHERE id=@Id", connection);

                command.Parameters.AddWithValue("@Id", item.Id);
                command.Parameters.AddWithValue("@Name", item.Name);
                command.Parameters.AddWithValue("@Description", item.Description);
                command.Parameters.AddWithValue("@Category", item.Category);

                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();

                return true;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error saving data to database!");
                return false;
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                using MySqlConnection connection = GetConnection();
                using MySqlCommand command = new MySqlCommand(
                    "DELETE FROM ads WHERE id=@Id", connection);

                command.Parameters.AddWithValue("@Id", id);

                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();

                return true;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error deleting item from database!");
                return false;
            }
        }

    }
}
