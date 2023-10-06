using API.DTOs.Basket.Response;

namespace API.DTOs.Auth.Response
{
    public class UserDTO
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public BasketDTO Basket { get; set; }
    }
}