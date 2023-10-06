using API.Entities.Base;

namespace API.Entities
{
	public class Product : BaseEntity
	{
		public string Name { get; set; }
		public string Description { get; set; }
		public decimal Price { get; set; }
		public string PictureUrl { get; set; }
		public string Brand { get; set; }
		public string Type { get; set; }
		public int QuantityInStock { get; set; }
		public string PublicId { get; set; }
	}
}
