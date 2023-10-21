using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
	public static class ProductExtensions
	{
		public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
		{
			if (string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);

			query = orderBy switch
			{
				"discounted" => query.Where(p => p.Discount > 0),
				"featured" => query.Where(p => p.isFeatured),
				"price" => query.OrderBy(p => p.Price),
				"priceDesc" => query.OrderByDescending(p => p.Price),
				_ => query.OrderBy(p => p.Name)
			};

			return query;
		}

		public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
		{
			if (string.IsNullOrWhiteSpace(searchTerm)) return query;

			var lowerCareSearchTerm = searchTerm.Trim().ToLower();

			return query.Where(p => p.Name.ToLower().Contains(lowerCareSearchTerm));
		}

		public static IQueryable<Product> Filter(this IQueryable<Product> query, string categories)
		{
			var categoryList = new List<string>();

			if (!string.IsNullOrEmpty(categories))
				categoryList.AddRange(categories.ToLower().Split(',').ToList());

			query = query.Where(p => categoryList.Count == 0 || categoryList.Contains(p.Category.Title.ToLower()));

			return query;
		}
	}
}
