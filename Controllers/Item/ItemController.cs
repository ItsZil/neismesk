﻿using Microsoft.AspNetCore.Mvc;
using neismesk.Models;
using System.Data;
using neismesk.Repositories.Category;
using neismesk.Repositories.Type;
using neismesk.Repositories.Item;
using neismesk.Repositories.Image;
using Microsoft.AspNetCore.Authorization;
using neismesk.ViewModels.Item;
using neismesk.Utilities;
using neismesk.Repositories.User;
using Newtonsoft.Json.Linq;
using neismesk.Services;

namespace neismesk.Controllers.Item
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : Controller
    {
        private readonly TypeRepo _typeRepo;
        private readonly CategoryRepo _categoryRepo;
        private readonly ItemRepo _itemRepo;
        private readonly ImageRepo _imageRepo;
        private readonly UserRepo _userRepo;
        private readonly QuestionnaireService _questionnaireService;
        private readonly OfferService _offerService;

        public ItemController()
        {
            _typeRepo = new TypeRepo();
            _categoryRepo = new CategoryRepo();
            _itemRepo = new ItemRepo();
            _imageRepo = new ImageRepo();
            _userRepo = new UserRepo();
            _questionnaireService = new QuestionnaireService();
            _offerService = new OfferService();
        }

        [HttpGet("getItems")]
        public async Task<IActionResult> GetItems()
        {
            try
            {
                var result = await _itemRepo.GetAll();

                if (result == null)
                {
                    return BadRequest();
                }

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
                var result = await _itemRepo.GetFullById(itemId);

                if (result == null)
                {
                    return BadRequest();
                }

                return Ok(result);
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
                var result = await _itemRepo.GetAllByUser(viewerId);

                if (result == null)
                {
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateItem()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            try
            {
                var form = await Request.ReadFormAsync();
                ItemModel item = new ItemModel()
                {
                    Name = form["name"].ToString(),
                    Description = form["description"].ToString(),
                    Location = form["location"].ToString(),
                    Status = 1,
                    User = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value),
                    Category = Convert.ToInt32(form["category"]),
                    Type = Convert.ToInt32(form["type"]),
                    Images = form.Files.GetFiles("images").ToList(),
                    Questions = form["questions"].ToList(),
                    EndDate = Convert.ToDateTime(form["endDate"]),
                };

                item.Id = await _itemRepo.Create(item);

                bool success = await _imageRepo.InsertImages(item);
                if (item.Type == 2)
                {
                    success = await _itemRepo.InsertQuestions(item);
                }
                return success == true ? Ok(item.Id) : BadRequest();
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }

        [HttpDelete("delete/{itemId}")]
        public async Task<IActionResult> DeleteItem(int itemId)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            try
            {
                var item = await _itemRepo.Find(itemId);
                if (item == null)
                {
                    return BadRequest();
                }

                await _itemRepo.Delete(itemId);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getCategories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _categoryRepo.GetAll();

                if (categories == null)
                {
                    return BadRequest();
                }

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getItemTypes")]
        public async Task<IActionResult> GetItemTypes()
        {
            try
            {
                var types = await _typeRepo.GetAll();

                if (types == null)
                {
                    return BadRequest();
                }

                return Ok(types);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateItem(int id, IFormCollection form)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            try
            {
                var item = await _itemRepo.Find(id);
                if (item == null)
                {
                    return BadRequest();
                }

                var update = new ItemModel()
                {
                    Id = id,
                    Name = form["name"].ToString(),
                    Description = form["description"].ToString(),
                    Category = Convert.ToInt32(form["fk_Category"]),
                    Images = Request.Form.Files.GetFiles("images").ToList()
                };

                // Get list of image IDs to delete
                var imagesToDelete = form["imagesToDelete"].Select(idStr => Convert.ToInt32(idStr)).ToList();

                // Delete images from database
                if (imagesToDelete.Count > 0)
                {
                    await _imageRepo.Delete(imagesToDelete);
                }
                // Update item in database
                await _itemRepo.Update(update);

                await _imageRepo.InsertImages(update);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string searchWord)
        {
            try
            {
                var searchResults = await _itemRepo.Search(searchWord);

                return Ok(searchResults);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("isUserParticipatingInLottery/{id}")]
        [Authorize]
        public async Task<IActionResult> IsUserParticipatingInLottery(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            int userId = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);
            try
            {
                var result = await _itemRepo.IsUserParticipatingInLottery(id, userId);
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("search/category/{categoryId}")]
        public async Task<IActionResult> GetItemsByCategory(int categoryId)
        {
            try
            {
                var result = await _itemRepo.GetAllByCategory(categoryId);

                if (result == null)
                {
                    return BadRequest();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("enterLottery/{id}")]
        public async Task<IActionResult> EnterLottery(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            
            int userId = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);
            try
            {
                var result = await _itemRepo.EnterLottery(id, userId);
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("leaveLottery/{id}")]
        [Authorize]
        public async Task<IActionResult> LeaveLottery(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            int userId = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);
            try
            {
                var result = await _itemRepo.LeaveLottery(id, userId);

                if (result == null)
                {
                    return BadRequest();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetCategory(int categoryId)
        {
            try
            {
                var result = await _itemRepo.GetCategoryById(categoryId);

                if (result == null)
                {
                    return BadRequest();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("submitWinnerDetails")]
        [Authorize]
        public async Task<IActionResult> SubmitWinnerDetails(ItemWinnerDetails details)
        {
            try
            {
                // Send an email to the item poster with winner details.
                Emailer emailer = new Emailer();
                bool result = await emailer.sendWinnerDetails(details.PosterEmail, details.ItemName, details.Phone, details.Message);

                // Set item status to 'Užbaigtas'
                await _itemRepo.UpdateItemStatus(details.ItemId, 3);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getQuestionsAndAnswers/{itemId}")]
        [Authorize]
        public async Task<IActionResult> GetQuestionsAndAnswers(int itemId)
        {
            try
            {
                var result = await _itemRepo.GetQuestionsAndAnswers(itemId);

                return Ok(new { questionnaires = result });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("submitAnswers/{itemId}")]
        public async Task<IActionResult> SubmitAnswers(int itemId, [FromBody] List<Answer> answers)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            
            int userId = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);
            try
            {
                var result = await _itemRepo.InsertAnswers(itemId, answers, userId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("chooseQuestionnaireWinner")]
        public async Task<IActionResult> ChooseQuestionnaireWinner([FromBody] QuestionnaireWinner winner)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            int userId = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);
            try
            {
                _questionnaireService.NotifyWinner(winner, userId);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("chooseOfferWinner")]
        public async Task<IActionResult> ChooseOfferWinner([FromBody] OfferWinner winner)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            
            int userId = Convert.ToInt32(HttpContext.User.FindFirst("user_id").Value);
            try
            {
                _offerService.NotifyWinner(winner, userId);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getLotteryParticipants/{itemId}")]
        [Authorize]
        public async Task<IActionResult> GetLotteryParticipants(int itemId)
        {
            try
            {
                var result = await _itemRepo.GetLotteryParticipants(itemId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("submitOffer/{itemId}")]
        public async Task<IActionResult> SubmitOffer(int itemId)
        {
            var form = await Request.ReadFormAsync();
            OfferModel offer = new OfferModel()
            {
                SelectedItem = Convert.ToInt32(form["selectedItem"]),
                Message = form["message"].ToString(),
            };

            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            try
            {
                var result = await _itemRepo.InsertOffer(itemId, offer);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("getOffers/{itemId}")]
        [Authorize]
        public async Task<IActionResult> GetOffers(int itemId)
        {
            try
            {
                var result = await _itemRepo.GetOffers(itemId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}