using Newtonsoft.Json;

namespace neismesk.ViewModels.Item
{
    //Might be unnecessary if we are getting data from a form
    public class ItemUpdateViewModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("fk_category")]
        public int fk_Category { get; set; }

        //[JsonProperty("images")]
        //public IFormFile Images { get; set; }
    }
}