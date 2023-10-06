using API.DTOs.Basket.Request;
using API.Entities;

namespace API.DTOs.Basket.Response
{
    public class BasketDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public List<BasketItemDTO> Items { get; set; }
        public string PaymentIntentId { get; set; }
        public string ClientSecret { get; set; }
    }
}