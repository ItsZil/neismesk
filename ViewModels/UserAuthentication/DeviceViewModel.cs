﻿using Newtonsoft.Json;

namespace neismesk.ViewModels.UserAuthentication
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
	}
}
