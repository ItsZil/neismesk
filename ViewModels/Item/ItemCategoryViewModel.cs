using Newtonsoft.Json;

namespace neismesk.ViewModels.Item
{
    public class ItemCategoryViewModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
    }
}
