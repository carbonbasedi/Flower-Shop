using API.DTOs.Product.Request;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers.MappingProfiles
{
	public class ProductMappingProfile : Profile
	{
		public ProductMappingProfile()
		{
			CreateMap<ProductCreateDTO, Product>();
			CreateMap<ProductUpdateDTO, Product>();
		}
	}
}
