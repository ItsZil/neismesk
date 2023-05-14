using Newtonsoft.Json;

namespace neismesk.ViewModels.Item
{
    public class TradingViewModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("location")]
        public string Location { get; set; }

        [JsonProperty("end_datetime")]
        public DateTime? EndDateTime { get; set; }

        [JsonProperty("images")]
        public List<ItemImageViewModel> Images { get; set; }

        [JsonProperty("user")]
        public string User { get; set; }
    }
}
