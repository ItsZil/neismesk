﻿using Microsoft.AspNetCore.Mvc;
using neismesk.Utilities;
using neismesk.ViewModels.Item;
using System.Data;

namespace neismesk.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly DatabaseAccess _database;

        public ItemController()
        {
            _database = new DatabaseAccess();
        }

        [HttpGet("getItems")]
        public async Task<IActionResult> GetItems()
        {
            try
            {
                var items = await _database.LoadData("SELECT id, name, description FROM ads");
                if (items == null)
                {
                    return BadRequest();
                }
                var result = (from DataRow dt in items.Rows
                              select new ItemViewModel()
                              {
                                  Id = Convert.ToInt32(dt["id"]),
                                  Name = dt["name"].ToString(),
                                  Description = dt["description"].ToString()
                              }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getItem/{itemId}")]
        public async Task<IActionResult> GetItem(int itemId)
        {
            try
            {
                var itemData = await _database.LoadData(
                    "SELECT ads.*, ad_type.type AS ad_type, categories.name AS category_name, status.name AS status_name, " +
                    "COUNT(ad_lottery_participants.id) AS participants_count, images.img_id AS image_id, images.img AS image_blob, " +
                    "GROUP_CONCAT(questions.question_text SEPARATOR ';') AS question_text, " +
                    "GROUP_CONCAT(images.img SEPARATOR ';') AS image_blob " +
                    "FROM ads " +
                    "JOIN ad_type ON ads.fk_type = ad_type.id " +
                    "JOIN categories ON ads.fk_category = categories.id " +
                    "JOIN status ON ads.fk_status = status.id " +
                    "LEFT JOIN ad_lottery_participants ON ads.id = ad_lottery_participants.fk_ad " +
                    "LEFT JOIN images ON images.fk_ad = ads.id " +
                    "LEFT JOIN questions ON questions.fk_ad = ads.id " +
                    "WHERE ads.id = " + itemId +
                    " GROUP BY ads.id, ad_type.type, categories.name, images.img_id, images.img"
                );

                // Create a list of questions.
                List<string> questions = new List<string>();
                if (itemData.Rows.Count > 0)
                {
                    string questionText = itemData.Rows[0]["question_text"].ToString();
                    questions = !string.IsNullOrEmpty(questionText) ? questionText.Split(';').ToList() : new List<string>();
                }

                // Create a list of image blobs.
                List<string> imageBlobs = new List<string>();
                if (itemData.Rows.Count > 0)
                {
                    string imageBlob = itemData.Rows[0]["image_blob"].ToString();
                    imageBlobs = !string.IsNullOrEmpty(imageBlob) ? imageBlob.Split(';').ToList() : new List<string>();
                }

                if (itemData == null)
                {
                    return BadRequest();
                }

                var result = (from DataRow dt in itemData.Rows
                              group dt by new
                              {
                                  Id = Convert.ToInt32(dt["id"]),
                                  UserId = Convert.ToInt32(dt["fk_user"]),
                                  Name = dt["name"].ToString(),
                                  Description = dt["description"].ToString(),
                                  Status = dt["status_name"].ToString(),
                                  Type = dt["ad_type"].ToString(),
                                  Participants = dt["participants_count"] == DBNull.Value ? null : (int?)Convert.ToInt32(dt["participants_count"]),
                                  Location = dt["location"].ToString(),
                                  Category = dt["category_name"].ToString(),
                                  CreationDateTime = Convert.ToDateTime(dt["creation_datetime"]),
                                  EndDateTime = dt["end_datetime"] == DBNull.Value ? null : (DateTime?)Convert.ToDateTime(dt["end_datetime"]),
                                  ImageId = dt["image_id"] == DBNull.Value ? null : (int?)Convert.ToInt32(dt["image_id"]),
                                  ImageBlob = dt["image_blob"] == DBNull.Value ? null : dt["image_blob"].ToString(),
                                  ImageBlob1 = dt["image_blob1"] == DBNull.Value ? null : dt["image_blob1"].ToString(),
                                  QuestionText = dt["question_text"] == DBNull.Value ? null : dt["question_text"].ToString()
                              } into grouped
                              select new ItemViewModel()
                              {
                                  Id = grouped.Key.Id,
                                  UserId = grouped.Key.UserId,
                                  Name = grouped.Key.Name,
                                  Description = grouped.Key.Description,
                                  Status = grouped.Key.Status,
                                  Type = grouped.Key.Type,
                                  Participants = grouped.Key.Participants,
                                  Location = grouped.Key.Location,
                                  Category = grouped.Key.Category,
                                  CreationDateTime = grouped.Key.CreationDateTime,
                                  EndDateTime = grouped.Key.EndDateTime,
                                  Images = (from DataRow imageRow in grouped
                                            where imageRow["image_id"] != DBNull.Value
                                            select new ItemImageViewModel()
                                            {
                                                Id = Convert.ToInt32(imageRow["image_id"]),
                                                File = imageRow["image_blob"] == DBNull.Value ? null : new FormFile(new MemoryStream(Convert.FromBase64String(imageRow["image_blob"].ToString())), 0, Convert.FromBase64String(imageRow["image_blob"].ToString()).Length, "image", "image.png")
                                            }).ToList(),
                                  Questions = (from DataRow questionRow in itemData.Rows
                                               where questionRow["id"].ToString() == grouped.First()["id"].ToString()
                                               select new ItemQuestionViewModel()
                                               {
                                                   Id = Convert.ToInt32(questionRow["id"]),
                                                   Question = questionRow["question_text"] == DBNull.Value ? null : questionRow["question_text"].ToString()
                                               }).ToList()
                              }).ToList();


                return Ok(result[0]);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getUserItems")]
        public async Task<IActionResult> GetUserItems()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            try
            {
                int viewerId = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);
                var itemData = await _database.LoadData(
                    "SELECT ads.*, ad_type.type AS ad_type, categories.name AS category_name, status.name AS status_name, " +
                    "COUNT(ad_lottery_participants.id) AS participants_count, images.img_id AS image_id, images.img AS image_blob, " +
                    "GROUP_CONCAT(questions.question_text SEPARATOR ';') AS question_text, " +
                    "GROUP_CONCAT(images.img SEPARATOR ';') AS image_blob " +
                    "FROM ads " +
                    "JOIN ad_type ON ads.fk_type = ad_type.id " +
                    "JOIN categories ON ads.fk_category = categories.id " +
                    "JOIN status ON ads.fk_status = status.id " +
                    "LEFT JOIN ad_lottery_participants ON ads.id = ad_lottery_participants.fk_ad " +
                    "LEFT JOIN images ON images.fk_ad = ads.id " +
                    "LEFT JOIN questions ON questions.fk_ad = ads.id " +
                    "WHERE ads.fk_user = " + viewerId +
                    " GROUP BY ads.id, ad_type.type, categories.name, images.img_id, images.img"
                );

                // Create a list of questions.
                List<string> questions = new List<string>();
                if (itemData.Rows.Count > 0)
                {
                    string questionText = itemData.Rows[0]["question_text"].ToString();
                    questions = !string.IsNullOrEmpty(questionText) ? questionText.Split(';').ToList() : new List<string>();
                }

                // Create a list of image blobs.
                List<string> imageBlobs = new List<string>();
                if (itemData.Rows.Count > 0)
                {
                    string imageBlob = itemData.Rows[0]["image_blob"].ToString();
                    imageBlobs = !string.IsNullOrEmpty(imageBlob) ? imageBlob.Split(';').ToList() : new List<string>();
                }

                if (itemData == null)
                {
                    return BadRequest();
                }

                var result = (from DataRow dt in itemData.Rows
                              group dt by new
                              {
                                  Id = Convert.ToInt32(dt["id"]),
                                  UserId = Convert.ToInt32(dt["fk_user"]),
                                  Name = dt["name"].ToString(),
                                  Description = dt["description"].ToString(),
                                  Status = dt["status_name"].ToString(),
                                  Type = dt["ad_type"].ToString(),
                                  Participants = dt["participants_count"] == DBNull.Value ? null : (int?)Convert.ToInt32(dt["participants_count"]),
                                  Location = dt["location"].ToString(),
                                  Category = dt["category_name"].ToString(),
                                  CreationDateTime = Convert.ToDateTime(dt["creation_datetime"]),
                                  EndDateTime = dt["end_datetime"] == DBNull.Value ? null : (DateTime?)Convert.ToDateTime(dt["end_datetime"]),
                                  ImageId = dt["image_id"] == DBNull.Value ? null : (int?)Convert.ToInt32(dt["image_id"]),
                                  ImageBlob = dt["image_blob"] == DBNull.Value ? null : dt["image_blob"].ToString(),
                                  ImageBlob1 = dt["image_blob1"] == DBNull.Value ? null : dt["image_blob1"].ToString(),
                                  QuestionText = dt["question_text"] == DBNull.Value ? null : dt["question_text"].ToString()
                              } into grouped
                              select new ItemViewModel()
                              {
                                  Id = grouped.Key.Id,
                                  UserId = grouped.Key.UserId,
                                  Name = grouped.Key.Name,
                                  Description = grouped.Key.Description,
                                  Status = grouped.Key.Status,
                                  Type = grouped.Key.Type,
                                  Participants = grouped.Key.Participants,
                                  Location = grouped.Key.Location,
                                  Category = grouped.Key.Category,
                                  CreationDateTime = grouped.Key.CreationDateTime,
                                  EndDateTime = grouped.Key.EndDateTime,
                                  Images = (from DataRow imageRow in grouped
                                            where imageRow["image_id"] != DBNull.Value
                                            select new ItemImageViewModel()
                                            {
                                                Id = Convert.ToInt32(imageRow["image_id"]),
                                                File = imageRow["image_blob"] == DBNull.Value ? null : new FormFile(new MemoryStream(Convert.FromBase64String(imageRow["image_blob"].ToString())), 0, Convert.FromBase64String(imageRow["image_blob"].ToString()).Length, "image", "image.png")
                                            }).ToList(),
                                  Questions = (from DataRow questionRow in itemData.Rows
                                               where questionRow["id"].ToString() == grouped.First()["id"].ToString()
                                               select new ItemQuestionViewModel()
                                               {
                                                   Id = Convert.ToInt32(questionRow["id"]),
                                                   Question = questionRow["question_text"] == DBNull.Value ? null : questionRow["question_text"].ToString()
                                               }).ToList()
                              }).ToList();


                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete/{itemId}")]
        public async Task<IActionResult> DeleteItem(int itemId)
        {
            try
            {
                // Check if item exists
                var item = await _database.LoadData($"SELECT * FROM ads WHERE id={itemId}");
                if (item == null || item.Rows.Count == 0)
                {
                    return BadRequest();
                }

                // Delete item from database
                await _database.SaveData($"DELETE FROM ads WHERE id={itemId}", itemId);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}