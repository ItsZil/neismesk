using neismesk.Models;
using neismesk.Repositories.Item;
using neismesk.Repositories.User;
using neismesk.Utilities;
using neismesk.ViewModels.User;

namespace neismesk.Services
{
    public class QuestionnaireService
    {
        private ItemRepo _itemRepo;
        private UserRepo _userRepo;

        public QuestionnaireService()
        {
            _itemRepo = new ItemRepo();
            _userRepo = new UserRepo();
        }

        public async void NotifyWinner(QuestionnaireWinner winner, int posterUserId)
        {
            Emailer emailer = new Emailer();

            string itemName = await _itemRepo.GetItemName(winner.ItemId);
            UserViewModel user = await _userRepo.GetUser(winner.User);

            await _itemRepo.SetItemWinner(winner.ItemId, user.Id);

            //await emailer.notifyLotteryPosterWin(posterUserEmail, lottery.Name, winnerUserEmail);
            await emailer.notifyQuestionnaireWinner(user.Email, itemName, winner.ItemId);

            // Update item status to 'Ištrinktas laimėtojas'
            await _itemRepo.UpdateItemStatus(winner.ItemId, 2);
        }
    }
}
