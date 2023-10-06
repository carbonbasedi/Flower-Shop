﻿using API.DTOs.Product.Response;

namespace API.DTOs.Category.Response
{
	public class CategoryDTO
	{
		public int Id { get; set; }
		public List<ProductDTO> Products { get; set; }
		public string Title { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime? ModifiedAt { get; set; }
	}
}
