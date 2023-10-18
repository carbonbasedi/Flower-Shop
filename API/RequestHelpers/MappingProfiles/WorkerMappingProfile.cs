
using API.DTOs.Worker.Request;
using API.DTOs.Worker.Response;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers.MappingProfiles
{
    public class WorkerMappingProfile : Profile
    {
        public WorkerMappingProfile()
        {
            CreateMap<Worker, WorkerDTO>()
                .ForMember(dest => dest.Duty, opt => opt.MapFrom(src => src.Duty.Title));
            CreateMap<WorkerCreateDTO, Worker>();
            CreateMap<WorkerUpdateDTO, Worker>();
        }
    }
}