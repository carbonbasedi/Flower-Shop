using API.DTOs.Duty.Request;
using API.DTOs.Duty.Response;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers.MappingProfiles
{
    public class DutyMappingProfile : Profile
    {
        public DutyMappingProfile()
        {
            CreateMap<Duty, DutyDTO>();
            CreateMap<DutyCreateDTO, Duty>();
            CreateMap<DutyUpdateDTO, Duty>();
        }
    }
}