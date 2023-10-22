namespace API.DTOs.Product.Response
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int QuantityInStock { get; set; }
        public string PictureUrl { get; set; }
        public int CategoryId { get; set; }
        public string Category { get; set; }
        public bool isFeatured { get; set; }
        public int Discount { get; set; }
        public decimal DiscountedPrice { get; set; }
    }
}