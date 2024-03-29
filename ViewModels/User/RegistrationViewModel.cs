﻿using Newtonsoft.Json;

namespace neismesk.ViewModels.UserAuthentication
{
    public class RegistrationViewModel
    {
        [JsonProperty("name")]
        public string Name { get; set; }

		[JsonProperty("surname")]
		public string Surname { get; set; }

		[JsonProperty("email")]
		public string Email { get; set; }
        
        [JsonProperty("password")]
		public string Password { get; set; }
    }
}
