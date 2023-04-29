using MySql.Data.MySqlClient;
using neismesk.Models;
using neismesk.Utilities;
using neismesk.ViewModels.Item;
using Serilog;
using System.Data;
using System.Data.Common;

namespace neismesk.Repositories
{
    public class ImageRepo
    {
        private Serilog.ILogger _logger;
        private readonly string _connectionString;

        public ImageRepo()
        {
            CreateLogger();

            _connectionString = Environment.GetEnvironmentVariable("DATABASE_CONN_STRING");
        }

        public ImageRepo(string connectionString)
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

        public async Task<bool> InsertImages(ItemModel item)
        {
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                foreach (IFormFile image in item.Images)
                {
                    byte[] data = await ImageUtilities.ResizeCompressImage(image, 640, 480);

                    using MySqlCommand command = new MySqlCommand(
                        "INSERT INTO images (img, fk_ad) VALUES (@image, @fk_ad)", connection);

                    // Add parameters
                    command.Parameters.AddWithValue("@image", data);
                    command.Parameters.AddWithValue("@fk_ad", item.Id);

                    await command.ExecuteNonQueryAsync();
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error saving images to database!");
                return false;
            }
        }

        public async Task<List<ItemImageViewModel>> GetByAd(int id)
        {
            List<ItemImageViewModel> images = new List<ItemImageViewModel>();
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using MySqlCommand command = new MySqlCommand(
                    "SELECT img_id, img FROM images WHERE fk_ad=@id", connection);
                command.Parameters.AddWithValue("@id", id);

                using DbDataReader reader = await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    int dataLength = (int)reader.GetBytes(1, 0, null, 0, int.MaxValue);
                    byte[] imageData = new byte[dataLength];
                    reader.GetBytes(1, 0, imageData, 0, dataLength);

                    ItemImageViewModel image = new()
                    {
                        Id = reader.GetInt32("img_id"),
                        Data = imageData,
                    };
                    images.Add(image);
                }
                return images;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting images from the database!");
                return images;
            }
        }

        public async Task<List<ItemImageViewModel>> GetByAdFirst(int id)
        {
            List<ItemImageViewModel> image = new List<ItemImageViewModel>();
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using MySqlCommand command = new MySqlCommand(
                    "SELECT img_id, img FROM images WHERE fk_ad=@id", connection);
                command.Parameters.AddWithValue("@id", id);

                using DbDataReader reader = await command.ExecuteReaderAsync();

                int dataLength = (int)reader.GetBytes(1, 0, null, 0, int.MaxValue);
                byte[] imageData = new byte[dataLength];
                reader.GetBytes(1, 0, imageData, 0, dataLength);

                var firstImage = new ItemImageViewModel()
                {
                    Id = reader.GetInt32("img_id"),
                    Data = imageData
                };

                image.Add(firstImage);

                return image;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting images from the database!");
                return image;
            }
        }

        public async Task<bool> Delete(List<int> ids)
        {
            try
            {
                using MySqlConnection connection = GetConnection();
                await connection.OpenAsync();

                using MySqlCommand command = new MySqlCommand(
                    "DELETE FROM images WHERE img_id = @id", connection);
                foreach (int id in ids)
                {
                    command.Parameters.AddWithValue("@id", id);
                }

                int rowsAffected = await command.ExecuteNonQueryAsync();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error deleting images from the database!");
                return false;
            }
        }
    }
}
