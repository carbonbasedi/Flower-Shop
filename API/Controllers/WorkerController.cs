using API.Controllers.Base;
using API.Data.Contexts;
using API.DTOs.Worker.Request;
using API.DTOs.Worker.Response;
using API.Entities;
using API.Extensions;
using API.RequestHelpers.Common;
using API.RequestHelpers.EntitiyParams;
using API.RequestHelpers.Validators.Worker;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class WorkerController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        private readonly ImageService _imageService;
        public WorkerController(AppDbContext context, IMapper mapper, ImageService imageService)
        {
            _imageService = imageService;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<WorkerDTO>>> GetAllWorkersAsync([FromQuery] WorkerParams workerParams)
        {
            var query = _context.Workers
                .Include(x => x.Duty)
                .Search(workerParams.SearchTerm)
                .Filter(workerParams.Duties)
                .AsQueryable();

            var workers = await PagedList<Worker>.ToPagedList(query, workerParams.PageNumber, workerParams.PageSize);

            Response.AddPaginationHeader(workers.MetaData);

            var mappedWorker = _mapper.Map<List<WorkerDTO>>(workers);

            return mappedWorker;
        }

        [HttpGet("{id}", Name = "GetWorker")]
        public async Task<ActionResult<WorkerDTO>> GetWorker(int id)
        {
            var worker = await _context.Workers.Include(x => x.Duty).FirstOrDefaultAsync(x => x.Id == id);
            if (worker is null) return NotFound();

            var mappedWorker = _mapper.Map<WorkerDTO>(worker);

            return mappedWorker;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Worker>> CreateWorkerAsync([FromForm] WorkerCreateDTO workerCreateDTO)
        {
            var vResult = await new WorkerCreateDTOValidator().ValidateAsync(workerCreateDTO);
            if (!vResult.IsValid)
            {
                foreach (var error in vResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.ErrorMessage);
                }
                return ValidationProblem();
            }

            var worker = _mapper.Map<Worker>(workerCreateDTO);
            if (workerCreateDTO.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(workerCreateDTO.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                worker.PictureUrl = imageResult.SecureUrl.ToString();
                worker.PublicId = imageResult.PublicId;
            }

            _context.Workers.Add(worker);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetWorker", new { Id = worker.Id }, worker);

            return BadRequest(new ProblemDetails { Title = "Problem creating new worker" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Worker>> UpdateWorker([FromForm] WorkerUpdateDTO workerUpdateDTO)
        {
            var vResult = await new WorkerUpdateDTOValidator().ValidateAsync(workerUpdateDTO);
            if (!vResult.IsValid)
            {
                foreach (var error in vResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.ErrorMessage);
                }
                return ValidationProblem();
            }

            var worker = await _context.Workers.FindAsync(workerUpdateDTO.Id);

            if (worker == null) return NotFound();

            _mapper.Map(workerUpdateDTO, worker);
            if (workerUpdateDTO.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(workerUpdateDTO.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                if (!string.IsNullOrEmpty(worker.PublicId))
                    await _imageService.DeleteImageAsync(worker.PublicId);

                worker.PictureUrl = imageResult.SecureUrl.ToString();
                worker.PublicId = imageResult.PublicId;
            }
            worker.ModifiedAt = DateTime.Now;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(worker);

            return BadRequest(new ProblemDetails { Title = "Problem updating worker profile" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteWorker(int id)
        {
            var worker = await _context.Workers.FindAsync(id);

            if (worker is null) return NotFound();

            if (!string.IsNullOrEmpty(worker.PublicId))
                await _imageService.DeleteImageAsync(worker.PublicId);

            _context.Workers.Remove(worker);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting worker profile" });
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var duties = await _context.Duties.ToListAsync();
            return Ok(new { duties });
        }
    }
}