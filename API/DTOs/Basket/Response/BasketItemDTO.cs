namespace API.DTOs.Basket.Request
{
    public class BasketItemDTO
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public string PictureUrl { get; set; }
        public int Quantity { get; set; }
    }
}