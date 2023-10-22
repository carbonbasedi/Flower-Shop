namespace API.Entities.OrderAggregate
{
    public class OrderItem
    {
        public int Id { get; set; }
        public ProductItemOrdered ItemOrdered { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public int Quantity { get; set; }
    }
}