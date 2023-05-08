using Newtonsoft.Json;

namespace neismesk.ViewModels.User
{
    public class EmailVerificationViewModel
    {
        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("token")]
        public string Token { get; set; }
    }
}
