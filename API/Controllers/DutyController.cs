using API.Controllers.Base;
using API.Data.Contexts;
using API.DTOs.Duty.Request;
using API.DTOs.Duty.Response;
using API.Entities;
using API.RequestHelpers.Validators.Duty;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class DutyController : BaseApiController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public DutyController(AppDbContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<DutyDTO>>> GetDutiesAsync()
        {
            var duties = await _context.Duties.Include(x => x.Workers).ToListAsync();

            var mappedDuties = _mapper.Map<List<DutyDTO>>(duties);

            return mappedDuties;
        }

        [HttpGet("{id}", Name = "GetDuty")]
        public async Task<ActionResult<DutyDTO>> GetDutyAsync(int id)
        {
            var duty = await _context.Duties.Include(x => x.Workers).FirstOrDefaultAsync(x => x.Id == id);
            if (duty is null) return NotFound();

            var mappedDuty = _mapper.Map<DutyDTO>(duty);
            return mappedDuty;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Duty>> CreateDuty([FromForm] DutyCreateDTO dutyCreateDTO)
        {
            var vResult = await new DutyCreateDTOValidator().ValidateAsync(dutyCreateDTO);
            if (!vResult.IsValid)
            {
                foreach (var error in vResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.ErrorMessage);
                }
                return ValidationProblem();
            }

            var duty = _mapper.Map<Duty>(dutyCreateDTO);

            _context.Duties.Add(duty);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetDuty", new { Id = duty.Id }, duty);

            return BadRequest(new ProblemDetails { Title = "Problem creating new duty" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Duty>> UpdateDuty([FromForm] DutyUpdateDTO dutyUpdateDTO)
        {
            var vResult = await new DutyUpdateDTOValidator().ValidateAsync(dutyUpdateDTO);
            if (!vResult.IsValid)
            {
                foreach (var error in vResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.ErrorMessage);
                }
                return ValidationProblem();
            }

            var duty = await _context.Duties.FindAsync(dutyUpdateDTO.Id);

            if (duty is null) return NotFound();

            _mapper.Map(dutyUpdateDTO, duty);

            duty.ModifiedAt = DateTime.Now;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(duty);

            return BadRequest(new ProblemDetails { Title = "Problem updating duty" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDuty(int id)
        {
            var duty = await _context.Duties.FindAsync(id);

            if (duty is null) return NotFound();

            _context.Duties.Remove(duty);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting duty" });
        }
    }
}