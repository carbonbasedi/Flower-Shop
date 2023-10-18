using API.Controllers.Base;
using API.Data.Contexts;
using API.DTOs.AboutUs;
using API.Entities;
using API.RequestHelpers.Validators.AboutUs;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AboutUsController : BaseApiController
    {
        private readonly ImageService _imageService;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        public AboutUsController(AppDbContext context, IMapper mapper, ImageService imageService)
        {
            _context = context;
            _mapper = mapper;
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<ActionResult<List<AboutUs>>> GetAboutUsAsync()
        {
            var aboutUs = await _context.AboutUs.ToListAsync();
            if (aboutUs == null) return NotFound();

            return aboutUs;
        }

        [HttpGet("{id}", Name = "GetAboutUs")]
        public async Task<ActionResult<AboutUs>> GetAboutUsAsync(int id)
        {
            var aboutUs = await _context.AboutUs.FindAsync(id);
            if (aboutUs == null) return NotFound();
            return aboutUs;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<AboutUs>> CreateAboutUs([FromForm] AboutUsCreateDTO createDTO)
        {
            var vResult = await new AboutUsCreateDTOValidator().ValidateAsync(createDTO);
            if (!vResult.IsValid)
            {
                foreach (var error in vResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.ErrorMessage);
                }
                return ValidationProblem();
            }

            var aboutUs = _mapper.Map<AboutUs>(createDTO);

            if (createDTO.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(createDTO.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                aboutUs.PictureUrl = imageResult.SecureUrl.ToString();
                aboutUs.PublicId = imageResult.PublicId;
            }

            _context.AboutUs.Add(aboutUs);

            var dbAboutUs = await _context.AboutUs.FirstOrDefaultAsync(x => x.Id != aboutUs.Id);
            if (dbAboutUs != null)
            {
                await _imageService.DeleteImageAsync(dbAboutUs.PublicId);
                _context.AboutUs.Remove(dbAboutUs);
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetAboutUs", new { Id = aboutUs.Id }, aboutUs);

            return BadRequest(new ProblemDetails { Title = "Problem creating new About info" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<AboutUs>> UpdateAboutUs([FromForm] AboutUsUpdateDTO updateDTO)
        {
            var vResult = await new AboutUsUpdateDTOValidator().ValidateAsync(updateDTO);
            if (!vResult.IsValid)
            {
                foreach (var error in vResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.ErrorMessage);
                }
                return ValidationProblem();
            }

            var aboutUs = await _context.AboutUs.FindAsync(updateDTO.Id);
            if (aboutUs == null) return NotFound();

            _mapper.Map(updateDTO, aboutUs);

            if (updateDTO.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(updateDTO.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                if (!string.IsNullOrEmpty(aboutUs.PublicId))
                    await _imageService.DeleteImageAsync(aboutUs.PublicId);

                aboutUs.PictureUrl = imageResult.SecureUrl.ToString();
                aboutUs.PublicId = imageResult.PublicId;
            }
            aboutUs.ModifiedAt = DateTime.Now;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(aboutUs);

            return BadRequest(new ProblemDetails { Title = "Problem updating about info" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAboutUs(int id)
        {
            var aboutUs = await _context.AboutUs.FindAsync(id);
            if (aboutUs is null) return NotFound();

            if (!string.IsNullOrEmpty(aboutUs.PublicId))
                await _imageService.DeleteImageAsync(aboutUs.PublicId);

            _context.AboutUs.Remove(aboutUs);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting about info" });
        }
    }
}