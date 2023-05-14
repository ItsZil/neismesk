using Newtonsoft.Json;

namespace neismesk.ViewModels.Repair
{
    public class RepairShopViewModel
    {
        [JsonProperty("name")]
        public string Name { get; set; }

		[JsonProperty("phone_number")]
		public string Phone_number { get; set; }

		[JsonProperty("email")]
		public string Email { get; set; }

        [JsonProperty("address")]
		public string Address { get; set; }
        
        [JsonProperty("city")]
		public string City { get; set; }
    }
}
