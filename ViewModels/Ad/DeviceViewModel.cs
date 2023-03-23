using Newtonsoft.Json;

namespace neismesk.ViewModels.Ad
{
    public class DeviceViewModel
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("category")]
        public string Category { get; set; }

        [JsonProperty("fk_user")]
        public int fk_User { get; set; }

        [JsonProperty("fk_category")]
        public int fk_Category { get; set; }

        [JsonProperty("images")]
        public List<byte[]> Images { get; set; }
    }
}
