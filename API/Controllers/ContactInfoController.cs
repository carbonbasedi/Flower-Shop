using API.Controllers.Base;
using API.Data.Contexts;
using API.DTOs.ContactInfo.Request;
using API.DTOs.ContactInfo.Response;
using API.Entities;
using API.RequestHelpers.Validators.ContactInfo;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ContactInfoController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        public ContactInfoController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<ContactInfoDTO>>> GetContactInfos()
        {
            var info = await _context.ContactInfo.ToListAsync();

            var infoDto = _mapper.Map<List<ContactInfoDTO>>(info);

            return infoDto;
        }

        [HttpGet("{id}", Name = "GetContactInfo")]
        public async Task<ActionResult<ContactInfoDTO>> GetContactInfo(int id)
        {
            var info = await _context.ContactInfo.FindAsync(id);
            if (info is null) return NotFound();
            var infoDTO = _mapper.Map<ContactInfoDTO>(info);
            return infoDTO;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ContactInfo>> CreateContactInfo([FromForm] ContactInfoCreateDTO contactInfoCreateDTO)
        {
            var vResult = await new ContactInfoCreateDTOValidator().ValidateAsync(contactInfoCreateDTO);
            if (!vResult.IsValid)
            {
                foreach (var error in vResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.ErrorMessage);
                }
                return ValidationProblem();
            }

            var info = _mapper.Map<ContactInfo>(contactInfoCreateDTO);
            _context.ContactInfo.Add(info);

            var dbInfo = await _context.ContactInfo.FirstOrDefaultAsync(x => x.Id != info.Id);
            if (dbInfo != null) _context.ContactInfo.Remove(dbInfo);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtRoute("GetContactInfo", new { Id = info.Id }, info);

            return BadRequest(new ProblemDetails { Title = "Problem creating new Contact info" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<ContactInfo>> UpdateContactInfo([FromForm] ContactInfoUpdateDTO contactInfoUpdateDTO)
        {
            var vResult = await new ContactInfoUpdateDTOValidator().ValidateAsync(contactInfoUpdateDTO);
            if (!vResult.IsValid)
            {
                foreach (var error in vResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.ErrorMessage);
                }
                return ValidationProblem();
            }

            var info = await _context.ContactInfo.FindAsync(contactInfoUpdateDTO.Id);
            if (info == null) return NotFound();

            _mapper.Map(contactInfoUpdateDTO, info);
            info.ModifiedAt = DateTime.Now;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(info);

            return BadRequest(new ProblemDetails { Title = "Problem updating Contact info" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteContact(int id)
        {
            var info = await _context.ContactInfo.FindAsync(id);
            if (info is null) return NotFound();

            _context.ContactInfo.Remove(info);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting Contact info" });
        }
    }
}