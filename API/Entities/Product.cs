using API.Entities.Base;

namespace API.Entities
{
	public class Product : BaseEntity
	{
		public string Name { get; set; }
		public string Description { get; set; }
		public decimal Price { get; set; }
		public string PictureUrl { get; set; }
		public int QuantityInStock { get; set; }
		public string PublicId { get; set; }
		public int CategoryId { get; set; }
		public Category Category { get; set; }
		public bool isFeatured { get; set; }
		public int Discount { get; set; }
		// public decimal? DiscountedPrice { get; set; }

		// public Product()
		// {
		// 	CalculateDiscountedPrice();
		// }

		// public void CalculateDiscountedPrice()
		// {
		// 	if (Discount > 0)
		// 	{
		// 		DiscountedPrice = Price - (Price * (decimal)Discount / 100);
		// 	}
		// 	else
		// 	{
		// 		DiscountedPrice = null;
		// 	}
		// }
	}
}
