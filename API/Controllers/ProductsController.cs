using API.Controllers.Base;
using API.Data.Contexts;
using API.DTOs.Product.Request;
using API.Entities;
using API.Extensions;
using API.RequestHelpers.Common;
using API.RequestHelpers.EntitiyParams;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	public class ProductsController : BaseApiController
	{
		private readonly AppDbContext _context;
		private readonly IMapper _mapper;

		public ProductsController(AppDbContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}

		[HttpGet]
		public async Task<ActionResult<List<Product>>> GetProductsAsync([FromQuery] ProductParams productParams)
		{
			var query = _context.Products
				.Sort(productParams.OrderBy)
				.Search(productParams.SearchTerm)
				.Filter(productParams.Brands, productParams.Types)
				.AsQueryable();

			var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

			Response.AddPaginationHeader(products.MetaData);

			return products;
		}

		[HttpGet("{id}", Name = "GetProduct")]
		public async Task<ActionResult<Product>> GetProductAsync(int id)
		{
			var product = await _context.Products.FindAsync(id);

			if (product == null) return NotFound();

			return product;
		}

		[HttpGet("filters")]
		public async Task<IActionResult> GetFilters()
		{
			var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
			var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

			return Ok(new { brands, types });
		}

		[HttpPost]
		public async Task<ActionResult<Product>> CreateProduct([FromForm] ProductCreateDTO productDTO)
		{
			var product = _mapper.Map<Product>(productDTO);

			//if(productDTO.File != null) { }

			_context.Products.Add(product);

			var result = await _context.SaveChangesAsync() > 0;

			if (result) return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);

			return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
		}

		[HttpPut]
		public async Task<ActionResult<Product>> UpdateProduct([FromForm] ProductUpdateDTO productDTO)
		{
			var product = await _context.Products.FindAsync(productDTO.Id);

			if (product == null) return NotFound();

			_mapper.Map(productDTO, product);

			//if ( productDTO.File != null ) { }

			var result = await _context.SaveChangesAsync() > 0;

			if (result) return Ok(product);

			return BadRequest(new ProblemDetails { Title = "Problem updating product" });
		}

		[HttpDelete("{id}")]
		public async Task<ActionResult> DeleteProduct(int id)
		{
			var product = await _context.Products.FindAsync(id);

			if (product == null) return NotFound();

			//if(!string.IsNullOrEmpty(product.PublicId))
			//await _imageService.DeleteImageAsync(product.PublicId);

			_context.Products.Remove(product);

			var result = await _context.SaveChangesAsync() > 0;

			if (result) return Ok();

			return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
		}
	}
}
