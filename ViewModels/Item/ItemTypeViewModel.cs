using Newtonsoft.Json;

namespace neismesk.ViewModels.Item
{
    public class ItemTypeViewModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
    }
}
