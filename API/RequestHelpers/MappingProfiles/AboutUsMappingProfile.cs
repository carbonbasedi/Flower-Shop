using API.DTOs.AboutUs;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers.MappingProfiles
{
    public class AboutUsMappingProfile : Profile
    {
        public AboutUsMappingProfile()
        {
            CreateMap<AboutUsCreateDTO, AboutUs>();
            CreateMap<AboutUsUpdateDTO, AboutUs>();
        }
    }
}