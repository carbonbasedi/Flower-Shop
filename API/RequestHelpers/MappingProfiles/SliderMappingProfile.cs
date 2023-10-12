using API.DTOs.Slider.Request;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers.MappingProfiles
{
    public class SliderMappingProfile : Profile
    {
        public SliderMappingProfile()
        {
            CreateMap<SliderCreateDTO, HomePageSlider>();
            CreateMap<SliderUpdateDTO, HomePageSlider>();
        }
    }
}