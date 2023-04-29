using MySql.Data.MySqlClient;
using neismesk.Models;
using neismesk.Utilities;
using neismesk.ViewModels.Item;
using Serilog;
using System.Data;
using System.Data.Common;

namespace neismesk.Repositories
{
    public class ItemRepo
    {
        private Serilog.ILogger _logger;
        private readonly string _connectionString;
        private readonly ImageRepo _imageRepo;

        public ItemRepo()
        {
            CreateLogger();

            _connectionString = Environment.GetEnvironmentVariable("DATABASE_CONN_STRING");
            _imageRepo = new ImageRepo();
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

        public async Task<List<ItemViewModel>> GetAll()
        {
            var items = new List<ItemViewModel>();

            try
            {
                using (MySqlConnection connection = new MySqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (MySqlCommand command = new MySqlCommand("SELECT ads.id, ads.name, ads.description, " +
                    "ads.fk_user, ads.location, ads.end_datetime, ad_type.type " +
                    "FROM ads " +
                    "LEFT JOIN ad_type ON ads.fk_type = ad_type.id " +
                    "WHERE ads.fk_status = 1", connection))
                    {
                        using (DbDataReader reader = await command.ExecuteReaderAsync())
                        {
                            await reader.ReadAsync();

                            while (await reader.ReadAsync())
                            {
                                var item = new ItemViewModel()
                                {
                                    Id = Convert.ToInt32(reader["id"]),
                                    UserId = Convert.ToInt32(reader["fk_user"]),
                                    Name = reader["name"].ToString(),
                                    Description = reader["description"].ToString(),
                                    Type = reader["ad_type"].ToString(),
                                    Location = reader["location"].ToString(),
                                    EndDateTime = Convert.ToDateTime(reader["end_datetime"]),
                                    Images = await _imageRepo.GetByAdFirst(Convert.ToInt32(reader["id"]))
                                };
                            }
                        }
                    }
                }

                return items;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error loading data from database!");
                return items;
            }
        }

        public async Task<ItemViewModel> GetFullById(int itemId)
        {
            var item = new ItemViewModel();

            try
            {
                var images = await _imageRepo.GetByAd(itemId);
                var questions = await GetQuestions(itemId);
                using (MySqlConnection connection = new MySqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (MySqlCommand command = new MySqlCommand("SELECT ads.*, ad_type.type AS ad_type, categories.name AS category_name, status.name AS status_name, " +
                        "COUNT(ad_lottery_participants.id) AS participants_count " +
                        "FROM ads " +
                        "JOIN ad_type ON ads.fk_type = ad_type.id " +
                        "JOIN categories ON ads.fk_category = categories.id " +
                        "JOIN status ON ads.fk_status = status.id " +
                        "LEFT JOIN ad_lottery_participants ON ads.id = ad_lottery_participants.fk_ad " +
                        "WHERE ads.id = @itemId " +
                        "GROUP BY ads.id, ad_type.type, categories.name, images.img_id, images.img", connection))
                    {
                        command.Parameters.AddWithValue("@itemId", itemId);
                        using (DbDataReader reader = await command.ExecuteReaderAsync())
                        {
                            await reader.ReadAsync();

                            item.Id = Convert.ToInt32(reader["id"]);
                            item.UserId = Convert.ToInt32(reader["fk_user"]);
                            item.Name = reader["name"].ToString();
                            item.Description = reader["description"].ToString();
                            item.Status = reader["status_name"].ToString();
                            item.Type = reader["ad_type"].ToString();
                            item.Participants = Convert.ToInt32(reader["participants_count"]);
                            item.Location = reader["location"].ToString();
                            item.Category = reader["category_name"].ToString();
                            item.CreationDateTime = Convert.ToDateTime(reader["creation_datetime"]);
                            item.EndDateTime = Convert.ToDateTime(reader["end_datetime"]);
                            item.Images = images;
                            item.Questions = questions;
                        }
                    }
                }

                return item;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error loading data from database!");
                return item;
            }
        }

        //public async Task<List<ItemTypeViewModel>> GetAllByUser(int userId)
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
                    await connection.OpenAsync();

                    using (var command = new MySqlCommand("SELECT id, type FROM ads WHERE id=@id", connection))
                    {
                        command.Parameters.AddWithValue("@id", id);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            item.Id = reader.GetInt32("id");
                            item.Name = reader.GetString("type");

                            return item;
                        }
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

        public async Task<List<ItemQuestionViewModel>> GetQuestions(int itemId)
        {
            List<ItemQuestionViewModel> questions = new List<ItemQuestionViewModel>();
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using MySqlCommand command = new MySqlCommand(
                    "SELECT question_text, id FROM questions where fk_ad=@itemId", connection);
                command.Parameters.AddWithValue("@itemId", itemId);

                using DbDataReader reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    int id = reader.GetInt32("id");
                    string text = reader.GetString("question_text");
                    ItemQuestionViewModel question = new ItemQuestionViewModel { Id = id, Question = text };
                    questions.Add(question);
                }

                return questions;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting questions from database!");
                return questions;
            }
        }

    }
}
