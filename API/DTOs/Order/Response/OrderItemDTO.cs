namespace API.DTOs.Order.Response
{
    public class OrderItemDTO
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public int Quantity { get; set; }
    }
}