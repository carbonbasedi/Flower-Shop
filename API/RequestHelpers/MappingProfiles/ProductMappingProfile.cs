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
			CreateMap<Product, ProductDTO>()
				.ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Title));

			CreateMap<ProductCreateDTO, Product>();
			CreateMap<ProductUpdateDTO, Product>();
		}
	}
}
