namespace API.DTOs.Product.Request
{
	public class ProductCreateDTO
	{
		public string Name { get; set; }
		public string Description { get; set; }
		public decimal Price { get; set; }
		public int QuantityInStock { get; set; }
		public string PictureUrl { get; set; }
		public IFormFile File { get; set; }
		public string Brand { get; set; }
		public string Type { get; set; }
	}
}
