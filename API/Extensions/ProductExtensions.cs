﻿using API.Entities;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace API.Extensions
{
	public static class ProductExtensions
	{
		public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
		{
			if (string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);

			query = orderBy switch
			{
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

		public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
		{
			var brandList = new List<string>();
			var typesList = new List<string>();

			if (!string.IsNullOrEmpty(brands))
				brandList.AddRange(brands.ToLower().Split(',').ToList());

			if (!string.IsNullOrEmpty(types))
				typesList.AddRange(types.ToLower().Split(',').ToList());

			query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
			query = query.Where(p => typesList.Count == 0 || typesList.Contains(p.Type.ToLower()));

			return query;
		}
	}
}
