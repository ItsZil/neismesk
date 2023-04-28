using MySql.Data.MySqlClient;
using neismesk.ViewModels.Item;
using Serilog;
using System.Data;

namespace neismesk.Repositories
{
    public class CategoryRepo
    {
        private Serilog.ILogger _logger;
        private readonly string _connectionString;

        public CategoryRepo()
        {
            CreateLogger();

            _connectionString = Environment.GetEnvironmentVariable("DATABASE_CONN_STRING");
        }

        public CategoryRepo(string connectionString)
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

        public async Task<List<ItemCategoryViewModel>> GetAll()
        {
            List<ItemCategoryViewModel> categories = new List<ItemCategoryViewModel>();

            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    using (var command = new MySqlCommand("SELECT * FROM categories", connection))
                    {
                        await connection.OpenAsync();
                        var dataTable = new DataTable();
                        using (var dataAdapter = new MySqlDataAdapter(command))
                        {
                            dataAdapter.Fill(dataTable);
                        }

                        categories = (from DataRow dt in dataTable.Rows
                                      select new ItemCategoryViewModel()
                                      {
                                          Id = Convert.ToInt32(dt["id"]),
                                          Name = dt["name"].ToString()
                                      }).ToList();

                        return categories;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error loading data from database!");
                return categories;
            }
        }
    }
}
