using MySql.Data.MySqlClient;
using neismesk.Models;
using neismesk.Repositories.Image;
using neismesk.ViewModels.Item;
using neismesk.ViewModels.User;
using Org.BouncyCastle.Cms;
using Serilog;
using System.Collections.Generic;
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
                using (MySqlCommand command = new MySqlCommand("SELECT ads.*, ad_type.type AS ad_type, categories.name AS category_name, status.name AS status_name, " +
                    "COUNT(ad_lottery_participants.id) AS participants_count " +
                    "FROM ads " +
                    "JOIN ad_type ON ads.fk_type = ad_type.id " +
                    "JOIN categories ON ads.fk_category = categories.id " +
                    "JOIN status ON ads.fk_status = status.id " +
                    "LEFT JOIN ad_lottery_participants ON ads.id = ad_lottery_participants.fk_ad " +
                    "WHERE ads.fk_user = @userId " +
                    "GROUP BY ads.id, ad_type.type, categories.name ", connection))
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

        public async Task<List<ItemViewModel>> GetAllByCategory(int categoryId)
        {
            List<ItemViewModel> items = new List<ItemViewModel>();


            using (var connection = new MySqlConnection(_connectionString))
            {
                using (MySqlCommand command = new MySqlCommand("SELECT ads.*, ad_type.type AS ad_type, " +
                    "categories.name AS category_name, status.name AS status_name, " +
                    "COUNT(ad_lottery_participants.id) AS participants_count " +
                    "FROM ads " +
                    "JOIN ad_type ON ads.fk_type = ad_type.id " +
                    "JOIN categories ON ads.fk_category = categories.id " +
                    "JOIN status ON ads.fk_status = status.id " +
                    "LEFT JOIN ad_lottery_participants ON ads.id = ad_lottery_participants.fk_ad " +
                    "WHERE ads.fk_category = @categoryId AND ads.fk_status = 1  " +
                    "GROUP BY ads.id, ad_type.type, categories.name", connection))
                {
                    await connection.OpenAsync();
                    command.Parameters.AddWithValue("@categoryId", categoryId);

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

        public async Task<string> GetItemName(int itemId)
        {
            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (MySqlCommand command = new MySqlCommand(
                    "SELECT name " +
                    "FROM ads " +
                    "WHERE id = @itemId ", connection))
                {
                    command.Parameters.AddWithValue("@itemId", itemId);
                    using (DbDataReader reader = await command.ExecuteReaderAsync())
                    {
                        await reader.ReadAsync();

                        string name = reader["name"].ToString();

                        return name;
                    }
                }
            }
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

        public async Task<Dictionary<string, List<QuestionnaireViewModel>>> GetQuestionsAndAnswers(int itemId)
        {
            using MySqlConnection connection = GetConnection();
            await connection.OpenAsync();

            using MySqlCommand command = new MySqlCommand(
                "SELECT a.answer_id AS id, a.answer, q.question_text, CONCAT(u.name, ' ', u.surname) AS user " +
                "FROM answers AS a " +
                "INNER JOIN questions AS q ON a.fk_question = q.id " +
                "INNER JOIN users AS u ON a.fk_user = u.user_id " +
                "WHERE a.fk_ad=@itemId", connection);
            command.Parameters.AddWithValue("@itemId", itemId);

            using DbDataReader reader = await command.ExecuteReaderAsync();

            List<QuestionnaireViewModel> results = new List<QuestionnaireViewModel>();
            while (await reader.ReadAsync())
            {
                int id = reader.GetInt32("id");
                string text = reader.GetString("question_text");
                string answer = reader.GetString("answer");
                string user = reader.GetString("user");
                QuestionnaireViewModel result = new QuestionnaireViewModel { Id = id, Question = text, Answer = answer, User = user };
                results.Add(result);
            }

            Dictionary<string, List<QuestionnaireViewModel>> groupedResults = results.GroupBy(r => r.User)
                .ToDictionary(g => g.Key, g => g.ToList());

            return groupedResults;
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

        public async Task<bool> InsertAnswers(int itemId, List<Answer> answers, int userId)
        {
            using MySqlConnection connection = GetConnection();
            await connection.OpenAsync();

            foreach (Answer answer in answers)
            {
                using MySqlCommand command = new MySqlCommand(
                    "INSERT INTO answers (answer, fk_question, fk_user, fk_ad) VALUES (@answer, @fk_question, @fk_user, @fk_ad)", connection);
            
                // Add parameters
                command.Parameters.AddWithValue("@answer", answer.Text);
                command.Parameters.AddWithValue("@fk_question", answer.Question);
                command.Parameters.AddWithValue("@fk_user", userId);
                command.Parameters.AddWithValue("@fk_ad", itemId);

                await command.ExecuteNonQueryAsync();
            }

            return true;
        }

        public async Task<List<ItemViewModel>> Search(string searchWord)
        {
            List<ItemViewModel> foundItems = new List<ItemViewModel>();
            using MySqlConnection connection = GetConnection();
            await connection.OpenAsync();

            using MySqlCommand command = new MySqlCommand(
               "SELECT id, name, description, fk_user, fk_status FROM ads " +
                "WHERE (name LIKE CONCAT('%', @searchWord, '%') OR description LIKE CONCAT('%', @searchWord, '%')) " +
                "AND fk_status = 1", connection);
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

        public async Task<bool> IsUserParticipatingInLottery(int itemId, int userId)
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

        public async Task<bool> EnterLottery(int itemId, int userId)
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

        public async Task<bool> LeaveLottery(int itemId, int userId)
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

        public async Task<List<ItemLotteryViewModel>> GetDueLotteries()
        {
            List<ItemLotteryViewModel> lotteriesList = new List<ItemLotteryViewModel>();
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

        public async Task<int> DrawLotteryWinner(int itemId)
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
                return reader.GetInt32("fk_user");
            }
            throw new Exception("Failed to draw lottery winner from database!");
        }

        public async Task<bool> UpdateItemStatus(int itemId, int newStatusId)
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

        public async Task<bool> SetItemWinner(int itemId, int winnerId)
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

        public async Task<ItemCategoryViewModel> GetCategoryById(int categoryId)
        {
            var category = new ItemCategoryViewModel();
            using MySqlConnection connection = GetConnection();
            await connection.OpenAsync();

            using MySqlCommand command = new MySqlCommand(
                "SELECT name FROM categories where id=@categoryId", connection);
            command.Parameters.AddWithValue("@categoryId", categoryId);

            using (DbDataReader reader = await command.ExecuteReaderAsync())
            {
                await reader.ReadAsync();
                category.Name = reader["name"].ToString();

                return category;
            }
        }

        public async Task<List<UserViewModel>> GetLotteryParticipants(int itemId)
        {
            List<UserViewModel> lotteryParticipants = new List<UserViewModel>();

            using MySqlConnection connection = GetConnection();
            await connection.OpenAsync();

            using MySqlCommand command = new MySqlCommand("SELECT users.user_id, users.name, users.surname, users.email " +
                "FROM users " +
                "JOIN ad_lottery_participants ON users.user_id = ad_lottery_participants.fk_user " +
                "WHERE ad_lottery_participants.fk_ad = @itemId", connection);
            command.Parameters.AddWithValue("@itemId", itemId);

            using DbDataReader reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                UserViewModel user = new UserViewModel();
                user.Id = reader.GetInt32("user_id");
                user.Name = reader.GetString("name");
                user.Surname = reader.GetString("surname");
                user.Email = reader.GetString("email");

                lotteryParticipants.Add(user);
            }
            return lotteryParticipants;
        }

        public async Task<bool> InsertOffer(int itemId, OfferModel offer)
        {
            using MySqlConnection connection = GetConnection();
            await connection.OpenAsync();

            using MySqlCommand command = new MySqlCommand(
                    "INSERT INTO ad_trading_offers (fk_main_item, fk_offer_item, offer_message) VALUES (@fk_main_item, @fk_offer_item, @offer_message)", connection);

            // Add parameters
            command.Parameters.AddWithValue("@fk_main_item", itemId);
            command.Parameters.AddWithValue("@fk_offer_item", offer.SelectedItem);
            command.Parameters.AddWithValue("@offer_message", offer.Message);

            await command.ExecuteNonQueryAsync();
            return true;
        }


        public async Task<List<TradingViewModel>> GetOffers(int itemId)
        {
            List<TradingViewModel> results = new List<TradingViewModel>();

            using MySqlConnection connection = GetConnection();
            await connection.OpenAsync();


            using MySqlCommand command = new MySqlCommand(
                "SELECT t.fk_offer_item, t.offer_message, a.name, a.description, a.location, a.end_datetime, CONCAT(u.name, ' ', u.surname) AS user " +
                "FROM ad_trading_offers AS t " +
                "INNER JOIN ads AS a ON a.id = t.fk_offer_item " +
        "JOIN users AS u ON a.fk_user = u.user_id " +
                "WHERE t.fk_main_item = @itemId ",
                connection);

            command.Parameters.AddWithValue("@itemId", itemId);


            using (DbDataReader reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    TradingViewModel result = new TradingViewModel
                    {
                        Id = reader.GetInt32("fk_offer_item"),
                        Message = reader.GetString("offer_message"),
                        Name = reader.GetString("name"),
                        Description = reader.GetString("description"),
                        Location = reader.GetString("location"),
                        EndDateTime = reader.GetDateTime("end_datetime"),
                        Images = await _imageRepo.GetByAd(Convert.ToInt32(reader["fk_offer_item"])),
                        User = reader.GetString("user"),
                    };
                results.Add(result);
            }
        }

            return results;
                           
        }

        public async Task<List<ItemViewModel>> GetPastEndDateItems()
        {
            List<ItemViewModel> items = new List<ItemViewModel>();

            using MySqlConnection connection = GetConnection();
            await connection.OpenAsync();

            using MySqlCommand command = new MySqlCommand(
                "SELECT ads.id, ads.name, ads.description, ads.location, ads.end_datetime, ads.fk_status, ads.fk_user, ads.fk_winner, status.name AS status_name " +
                "FROM ads " +
                "JOIN status ON ads.fk_status = status.id " +
                "WHERE end_datetime < NOW() AND fk_status = 1", connection);

            using (DbDataReader reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    ItemViewModel item = new ItemViewModel
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        Description = reader.GetString("description"),
                        Location = reader.GetString("location"),
                        EndDateTime = reader.GetDateTime("end_datetime"),
                        Status = reader.GetString("status_name"),
                        UserId = reader.GetInt32("fk_user")
                    };
                    items.Add(item);
                }
            }
            return items;
        }
    }
}
