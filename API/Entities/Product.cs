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
		private decimal? _discountedPrice;
		public decimal? DiscountedPrice
		{
			get
			{
				if (Discount > 0)
				{
					return Price - (Price * (decimal)Discount / 100);
				}
				return null;
			}
			set
			{
				_discountedPrice = value;
			}
		}
	}
}
