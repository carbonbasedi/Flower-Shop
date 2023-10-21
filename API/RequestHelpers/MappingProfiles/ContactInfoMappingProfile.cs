using API.DTOs.ContactInfo.Request;
using API.DTOs.ContactInfo.Response;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers.MappingProfiles
{
    public class ContactInfoMappingProfile : Profile
    {
        public ContactInfoMappingProfile()
        {
            CreateMap<ContactInfo, ContactInfoDTO>();
            CreateMap<ContactInfoCreateDTO, ContactInfo>();
            CreateMap<ContactInfoUpdateDTO, ContactInfo>();
        }
    }
}