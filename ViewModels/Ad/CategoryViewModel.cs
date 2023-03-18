using Newtonsoft.Json;

namespace neismesk.ViewModels.Ad
{
	public class CategoryViewModel
	{
		[JsonProperty("id")]
		public int Id { get; set; }

		[JsonProperty("name")]
		public string Name { get; set; }
	}
}
