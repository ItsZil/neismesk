using Newtonsoft.Json;

namespace neismesk.ViewModels.UserAuthentication
{
    public class LoginViewModel
    {
        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }
    }
}
