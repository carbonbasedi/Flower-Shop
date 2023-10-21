using API.Entities.OrderAggregate;

namespace API.DTOs.Order.Response
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public ShippingAddress ShippingAddress { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItemDTO> OrderItems { get; set; }
        public decimal Subtotal { get; set; }
        public decimal DeliveryFee { get; set; }
        public string OrderStatus { get; set; }
        public decimal Total { get; set; }
        public bool isDelivered { get; set; }
    }
}