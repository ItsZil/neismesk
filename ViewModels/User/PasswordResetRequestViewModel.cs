using Newtonsoft.Json;

namespace neismesk.ViewModels.User
{
    public class PasswordResetRequestViewModel
    {
        [JsonProperty("email")]
        public string Email { get; set; }
    }
}
