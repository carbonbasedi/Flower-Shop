using API.Controllers.Base;
using API.Data.Contexts;
using API.DTOs.Slider.Request;
using API.Entities;
using API.Extensions;
using API.RequestHelpers.Common;
using API.RequestHelpers.EntitiyParams;
using API.RequestHelpers.Validators;
using API.RequestHelpers.Validators.Slider;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class SliderController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        private readonly ImageService _imageService;
        public SliderController(AppDbContext context, IMapper mapper, ImageService imageService)
        {
            _imageService = imageService;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<HomePageSlider>>> GetSliderAsync([FromQuery] SliderParams sliderParams)
        {
            var query = _context.Sliders
                .Sort(sliderParams.OrderBy)
                .AsQueryable();

            var sliders = await PagedList<HomePageSlider>.ToPagedList(query, sliderParams.PageNumber, sliderParams.PageSize);

            Response.AddPaginationHeader(sliders.MetaData);

            return sliders;
        }

        [HttpGet("{id}", Name = "GetSlider")]
        public async Task<ActionResult<HomePageSlider>> GetSliderAsync(int id)
        {
            var slider = await _context.Sliders.FindAsync(id);

            if (slider == null) return NotFound();

            return slider;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<HomePageSlider>> CreateSlider([FromForm] SliderCreateDTO sliderDTO)
        {
            var validationResult = await new SliderCreateDTOValidator().ValidateAsync(sliderDTO);
            if (!validationResult.IsValid)
                return BadRequest(new ProblemDetails { Title = "Validation Error" });

            var slider = _mapper.Map<HomePageSlider>(sliderDTO);

            if (sliderDTO.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(sliderDTO.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                slider.PictureUrl = imageResult.SecureUrl.ToString();
                slider.PublicId = imageResult.PublicId;
            }

            _context.Sliders.Add(slider);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetSlider", new { Id = slider.Id }, slider);

            return BadRequest(new ProblemDetails { Title = "Problem creating new slider" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<HomePageSlider>> UpdateSlider([FromForm] SliderUpdateDTO sliderDTO)
        {
            var validationResult = await new SliderUpdateDTOValidator().ValidateAsync(sliderDTO);
            if (!validationResult.IsValid)
                return BadRequest(new ProblemDetails { Title = "Validation Error" });

            var slider = await _context.Sliders.FindAsync(sliderDTO.Id);

            if (slider == null) return NotFound();

            _mapper.Map(sliderDTO, slider);

            if (sliderDTO.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(sliderDTO.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                if (!string.IsNullOrEmpty(slider.PublicId))
                    await _imageService.DeleteImageAsync(slider.PublicId);

                slider.PictureUrl = imageResult.SecureUrl.ToString();
                slider.PublicId = imageResult.PublicId;
            }
            slider.ModifiedAt = DateTime.Now;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(slider);

            return BadRequest(new ProblemDetails { Title = "Problem updating slider" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSlider(int id)
        {
            var slider = await _context.Sliders.FindAsync(id);

            if (slider == null) return NotFound();

            if (!string.IsNullOrEmpty(slider.PublicId))
                await _imageService.DeleteImageAsync(slider.PublicId);

            _context.Sliders.Remove(slider);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
        }
    }
}