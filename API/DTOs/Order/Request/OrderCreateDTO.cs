using API.Entities.OrderAggregate;

namespace API.DTOs.Order.Request
{
    public class CreateOrderDTO
    {
        public bool SaveAddress { get; set; }
        public ShippingAddress ShippingAddress { get; set; }
    }
}