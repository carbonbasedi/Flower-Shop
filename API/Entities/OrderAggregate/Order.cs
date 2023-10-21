using System.ComponentModel.DataAnnotations;
using API.Entities.OrderAggregate;

namespace API.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; }

        [Required]
        public ShippingAddress ShippingAddress { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public List<OrderItem> OrderItems { get; set; }
        public decimal Subtotal { get; set; }
        public decimal DeliveryFee { get; set; }
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
        public string PaymentIntentId { get; set; }
        public bool isDelivered { get; set; }

        public decimal GetTotal()
        {
            return Subtotal + DeliveryFee;
        }
    }
}