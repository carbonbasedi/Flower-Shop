using API.DTOs.Category.Request;
using API.DTOs.Category.Response;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers.MappingProfiles
{
    public class CategoryMappingProfile : Profile
    {
        public CategoryMappingProfile()
        {
            CreateMap<Category, CategoryDTO>();
            CreateMap<CategoryCreateDTO, Category>();
            CreateMap<CategoryUpdateDTO, Category>();
        }
    }
}