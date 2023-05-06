using neismesk.Repositories.Item;
using neismesk.ViewModels.Item;

namespace neismesk.Services
{
    public class LotteryService : IHostedService, IDisposable
    {
        private Timer _timer;
        private ItemRepo _itemRepo;

        public LotteryService()
        {
            _itemRepo = new ItemRepo();
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(DoTask, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Dispose();
            return Task.CompletedTask;
        }

        private async void DoTask(object? state)
        {
            List<ItemLotteryViewModel> dueLotteriesList = await _itemRepo.GetDueLotteries();

            foreach (var lottery in dueLotteriesList)
            {
                if (lottery.Participants > 0)
                {
                    int winnerUserId = await _itemRepo.DrawLotteryWinner(lottery.Id);
                    //await _itemRepo.SetItemWinner(lottery.Id, winnerUserId);

                    // Send email notification to poster (await details or reach out thru email) and winner (go to laimejimas/id)

                    // Update item status to 'Ištrinktas laimėtojas'
                    // await _itemRepo.UpdateItemStatus(lottery.Id, 2);
                }
                else
                {
                    // TODO: Send notification to user that there were no participants. Also extend?
                }
            }
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
