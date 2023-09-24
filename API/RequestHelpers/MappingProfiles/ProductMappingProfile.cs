using API.DTOs.Product.Request;
using API.DTOs.Product.Response;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers.MappingProfiles
{
	public class ProductMappingProfile : Profile
	{
		public ProductMappingProfile()
		{
			CreateMap<ProductCreateDTO, Product>();
			CreateMap<Product, ProductDTO>();
			CreateMap<ProductUpdateDTO, Product>();
		}
	}
}
