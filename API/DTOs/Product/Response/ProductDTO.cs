namespace API.DTOs.Product.Response
{
	public class ProductDTO
	{
		public int Id { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime? ModifiedAt { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public decimal Price { get; set; }
		public int QuantityInStock { get; set; }
		public string PictureUrl { get; set; }
	}
}
