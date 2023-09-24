using API.RequestHelpers.Common;

namespace API.RequestHelpers.EntitiyParams
{
	public class ProductParams : PaginationParams
	{
		public string OrderBy { get; set; }
		public string SearchTerm { get; set; }
		public string Types { get; set; }
		public string Brands { get; set; }
	}
}
