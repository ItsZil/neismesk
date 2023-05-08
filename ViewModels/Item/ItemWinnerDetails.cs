using Newtonsoft.Json;

namespace neismesk.ViewModels.Item
{
    public class ItemWinnerDetails
    {        
        [JsonProperty("winnerId")]
        public int WinnerId { get; set; }

        [JsonProperty("itemId")]
        public int ItemId { get; set; }

        [JsonProperty("itemName")]
        public string ItemName { get; set; }

        [JsonProperty("phone")]
        public string Phone { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("posterEmail")]
        public string PosterEmail { get; set; }
    }
}
