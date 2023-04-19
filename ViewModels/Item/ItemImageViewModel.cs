using Newtonsoft.Json;

namespace neismesk.ViewModels.Item
{
    public class ItemImageViewModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("file")]
        public IFormFile File { get; set; }
    }
}
