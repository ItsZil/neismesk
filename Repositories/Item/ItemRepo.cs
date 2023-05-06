using MySql.Data.MySqlClient;
using neismesk.Models;
using neismesk.Repositories.Image;
using neismesk.ViewModels.Item;
using Org.BouncyCastle.Cms;
using Serilog;
using System.Data;
using System.Data.Common;

namespace neismesk.Repositories.Item
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

            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (MySqlCommand command = new MySqlCommand("SELECT ads.id, ads.name, ads.description, " +
                "ads.fk_user, ads.location, ads.end_datetime, ad_type.type as type " +
                "FROM ads " +
                "LEFT JOIN ad_type ON ads.fk_type = ad_type.id " +
                "WHERE ads.fk_status = 1", connection))
                {
                    using (DbDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var item = new ItemViewModel()
                            {
                                Id = Convert.ToInt32(reader["id"]),
                                UserId = Convert.ToInt32(reader["fk_user"]),
                                Name = reader["name"].ToString(),
                                Description = reader["description"].ToString(),
                                Type = reader["type"].ToString(),
                                Location = reader["location"].ToString(),
                                EndDateTime = Convert.ToDateTime(reader["end_datetime"])
                            };

                            item.Images = await _imageRepo.GetByAdFirst(item.Id);

                            items.Add(item);
                        }
                    }
                }
            }

            return items;
        }

        public async Task<ItemViewModel> GetFullById(int itemId)
        {
            var item = new ItemViewModel();

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
                    "GROUP BY ads.id, ad_type.type, categories.name", connection))
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
                        item.WinnerId = reader["fk_winner"] == DBNull.Value ? null : (int?)Convert.ToInt32(reader["fk_winner"]);
                        item.Images = images;
                        item.Questions = questions;

                        return item;
                    }
                }
            }
        }

        public async Task<List<ItemViewModel>> GetAllByUser(int userId)
        {
            List<ItemViewModel> items = new List<ItemViewModel>();

            using (var connection = new MySqlConnection(_connectionString))
            {
                using (MySqlCommand command = new MySqlCommand("SELECT ads.*, ad_type.type AS ad_type, " +
                    "categories.name AS category_name, status.name AS status_name, " +
                    "COUNT(ad_lottery_participants.id) AS participants_count, " +
                    "FROM ads " +
                    "JOIN ad_type ON ads.fk_type = ad_type.id " +
                    "JOIN categories ON ads.fk_category = categories.id " +
                    "JOIN status ON ads.fk_status = status.id " +
                    "LEFT JOIN ad_lottery_participants ON ads.id = ad_lottery_participants.fk_ad " +
                    "WHERE ads.fk_user = @userId " +
                    "GROUP BY ads.id, ad_type.type, categories.name", connection))
                {
                    await connection.OpenAsync();
                    command.Parameters.AddWithValue("@userId", userId);

                    using (DbDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var item = new ItemViewModel()
                            {
                                Id = Convert.ToInt32(reader["id"]),
                                UserId = Convert.ToInt32(reader["fk_user"]),
                                Name = reader["name"].ToString(),
                                Description = reader["description"].ToString(),
                                Status = reader["status_name"].ToString(),
                                Type = reader["ad_type"].ToString(),
                                Participants = Convert.ToInt32(reader["participants_count"]),
                                Location = reader["location"].ToString(),
                                Category = reader["category_name"].ToString(),
                                CreationDateTime = Convert.ToDateTime(reader["creation_datetime"]),
                                EndDateTime = Convert.ToDateTime(reader["end_datetime"]),
                                WinnerId = reader["fk_winner"] == DBNull.Value ? null : (int?)Convert.ToInt32(reader["fk_winner"]),
                                Images = await _imageRepo.GetByAd(Convert.ToInt32(reader["id"])),
                                Questions = await GetQuestions(Convert.ToInt32(reader["id"]))
                            };

                            items.Add(item);
                        }
                    }

                    return items;
                }
            }
        }

        public async Task<int> Create(ItemModel item)
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

        public async Task<ItemViewModel> Find(int id)
        {
            ItemViewModel item = new ItemViewModel();

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new MySqlCommand("SELECT id, fk_type FROM ads WHERE id=@id", connection))
                {
                    command.Parameters.AddWithValue("@id", id);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        await reader.ReadAsync();

                        item.Id = reader.GetInt32("id");
                        item.Name = reader.GetString("fk_type");

                        return item;
                    }
                }
            }
        }

        public async Task<bool> Update(ItemModel item)
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

        public async Task<bool> Delete(int id)
        {
            using MySqlConnection connection = GetConnection();
            using MySqlCommand command = new MySqlCommand(
                "DELETE FROM ads WHERE id=@Id", connection);

            command.Parameters.AddWithValue("@Id", id);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            return true;
        }

        public async Task<List<ItemQuestionViewModel>> GetQuestions(int itemId)
        {
            List<ItemQuestionViewModel> questions = new List<ItemQuestionViewModel>();
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

        public async Task<bool> InsertQuestions(ItemModel item)
        {
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                foreach (string question in item.Questions)
                {
                    using MySqlCommand command = new MySqlCommand(
                        "INSERT INTO questions (question_text, fk_ad) VALUES (@question, @fk_ad)", connection);

                    // Add parameters
                    command.Parameters.AddWithValue("@question", question);
                    command.Parameters.AddWithValue("@fk_ad", item.Id);

                    await command.ExecuteNonQueryAsync();
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error saving questions to database!");
                return false;
            }
        }

        public async Task<List<ItemViewModel>> Search(string searchWord)
        {
            List<ItemViewModel> foundItems = new List<ItemViewModel>();
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using MySqlCommand command = new MySqlCommand(
                    "SELECT id, name, description, fk_user FROM ads " +
                    "WHERE name LIKE CONCAT('%', @searchWord, '%') " +
                    "OR description LIKE CONCAT('%', @searchWord, '%')", connection);
                command.Parameters.AddWithValue("@searchWord", searchWord);

                using DbDataReader reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    ItemViewModel item = new()
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        Description = reader.GetString("description"),
                        UserId = reader.GetInt32("fk_user"),
                        Images = await _imageRepo.GetByAdFirst(reader.GetInt32("id"))
                    };
                    foundItems.Add(item);
                }

                return foundItems;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting items by search word from database!");
                return foundItems;
            }
        }

        public async Task<bool> IsUserParticipatingInLottery(int itemId, int userId)
        {
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using MySqlCommand command = new MySqlCommand(
                    "SELECT id FROM ad_lottery_participants " +
                    "WHERE fk_ad = @fk_ad AND fk_user = @fk_user ", connection);
                command.Parameters.AddWithValue("@fk_ad", itemId);
                command.Parameters.AddWithValue("@fk_user", userId);


                using DbDataReader reader = await command.ExecuteReaderAsync();
                return reader.HasRows;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error checking if user is participating in lottery from database!");
                return false;
            }
        }

        public async Task<bool> EnterLottery(int itemId, int userId)
        {
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using MySqlCommand command = new MySqlCommand(
                    "INSERT INTO ad_lottery_participants " +
                    "(fk_ad, fk_user) VALUES (@fk_ad, @fk_user)", connection);
                command.Parameters.AddWithValue("@fk_ad", itemId);
                command.Parameters.AddWithValue("@fk_user", userId);

                await command.ExecuteNonQueryAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error entering user into lottery!");
                return false;
            }
        }

        public async Task<bool> LeaveLottery(int itemId, int userId)
        {
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using MySqlCommand command = new MySqlCommand(
                    "DELETE FROM ad_lottery_participants " +
                    "WHERE fk_ad = @fk_ad AND fk_user = @fk_user ", connection);
                command.Parameters.AddWithValue("@fk_ad", itemId);
                command.Parameters.AddWithValue("@fk_user", userId);

                await command.ExecuteNonQueryAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error exiting user from lottery!");
                return false;
            }
        }

        public async Task<List<ItemLotteryViewModel>> GetDueLotteries()
        {
            List<ItemLotteryViewModel> lotteriesList = new List<ItemLotteryViewModel>();
            try
            {
                DateTime dateTimeNow = DateTime.Now;

                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using (MySqlCommand command = new MySqlCommand("SELECT ads.id, ads.fk_user AS UserId, ads.name AS Name, ads.description AS Description, COUNT(ad_lottery_participants.id) " +
                    "AS Participants, ads.location AS Location, categories.name AS Category " +
                    "FROM ads " +
                    "JOIN categories ON ads.fk_category = categories.id " +
                    "LEFT JOIN ad_lottery_participants ON ads.id = ad_lottery_participants.fk_ad " +
                    "WHERE ads.end_datetime <= @dateTimeNow AND ads.fk_status = 1 AND ads.fk_type = 1 " +
                    "GROUP BY ads.id, ads.fk_user, ads.name, ads.description, ads.location, categories.name", connection))
                {
                command.Parameters.AddWithValue("@dateTimeNow", dateTimeNow);

                using DbDataReader reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    ItemLotteryViewModel item = new ItemLotteryViewModel();
                        item.Id = reader.GetInt32("id");
                        item.UserId = reader.GetInt32("UserId");
                        item.Name = reader.GetString("Name");
                        item.Description = reader.GetString("Description");
                        item.Participants = reader.GetInt32("Participants");
                        item.Location = reader.GetString("Location");
                        item.Category = reader.GetString("Category");

                        lotteriesList.Add(item);
                    }
                }
                return lotteriesList;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting due lotteries!");
                return lotteriesList;
            }
        }

        public async Task<int> DrawLotteryWinner(int itemId)
        {
            int winner = -1;
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using MySqlCommand command = new MySqlCommand(
                    "SELECT fk_user FROM ad_lottery_participants " +
                    "WHERE fk_ad = @fk_ad " +
                    "ORDER BY RAND() " +
                    "LIMIT 1", connection);
                command.Parameters.AddWithValue("@fk_ad", itemId);

                using DbDataReader reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    winner = reader.GetInt32("fk_user");
                }
                return winner;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Error drawing lottery winner for lottery id {itemId}!");
                return winner;
            }
        }

        public async Task<bool> UpdateItemStatus(int itemId, int newStatusId)
        {
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using MySqlCommand command = new MySqlCommand(
                    "UPDATE ads " +
                    "SET fk_status = @fk_status " +
                    "WHERE id = @id", connection);
                command.Parameters.AddWithValue("@fk_status", newStatusId);
                command.Parameters.AddWithValue("@id", itemId);

                await command.ExecuteNonQueryAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Error updating item status for item id {itemId}!");
                return false;
            }
        }

        public async Task<bool> SetItemWinner(int itemId, int winnerId)
        {
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using MySqlCommand command = new MySqlCommand(
                    "UPDATE ads " +
                    "SET fk_winner = @fk_winner " +
                    "WHERE id = @id", connection);
                command.Parameters.AddWithValue("@fk_winner", winnerId);
                command.Parameters.AddWithValue("@id", itemId);

                await command.ExecuteNonQueryAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Error setting item winner for item id {itemId}!");
                return false;
            }
        }
    }
}
