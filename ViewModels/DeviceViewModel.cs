using Newtonsoft.Json;

namespace neismesk.ViewModels
{
    public class DeviceViewModel
    {
            [JsonProperty("id")]
            public int Id { get; set; }

            [JsonProperty("name")]
            public string Name { get; set; }

            [JsonProperty("description")]
            public string Description { get; set; }

    }
}
