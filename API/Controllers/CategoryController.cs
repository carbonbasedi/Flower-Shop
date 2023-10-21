using API.Controllers.Base;
using API.Data.Contexts;
using API.DTOs.Category.Request;
using API.DTOs.Category.Response;
using API.Entities;
using API.RequestHelpers.Validators.Category;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CategoryController : BaseApiController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public CategoryController(AppDbContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<CategoryDTO>>> GetCategories()
        {
            var categories = await _context.Categories.Include(x => x.Products).ToListAsync();

            var categoriesDto = _mapper.Map<List<CategoryDTO>>(categories);

            return categoriesDto;
        }

        [HttpGet("{id}", Name = "GetCategory")]
        public async Task<ActionResult<CategoryDTO>> GetCategoryAsync(int id)
        {
            var category = await _context.Categories.Include(x => x.Products).FirstOrDefaultAsync(x => x.Id == id);
            if (category is null) return NotFound();

            var categoryDto = _mapper.Map<CategoryDTO>(category);
            return categoryDto;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory([FromForm] CategoryCreateDTO categoryCreateDTO)
        {
            var vResult = await new CategoryCreateDTOValidator().ValidateAsync(categoryCreateDTO);
            if (!vResult.IsValid)
            {
                foreach (var error in vResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.ErrorMessage);
                }
                return ValidationProblem();
            }

            var category = _mapper.Map<Category>(categoryCreateDTO);

            _context.Categories.Add(category);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetCategory", new { Id = category.Id }, category);

            return BadRequest(new ProblemDetails { Title = "Problem creatin new category" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Category>> UpdateCategory([FromForm] CategoryUpdateDTO categoryUpdateDTO)
        {
            var vResult = await new CategoryUpdateDTOValidator().ValidateAsync(categoryUpdateDTO);
            if (!vResult.IsValid)
            {
                foreach (var error in vResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.ErrorMessage);
                }
                return ValidationProblem();
            }

            var category = await _context.Categories.FindAsync(categoryUpdateDTO.Id);

            if (category is null) return NotFound();

            _mapper.Map(categoryUpdateDTO, category);

            category.ModifiedAt = DateTime.Now;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem updating category" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category is null) return NotFound();

            _context.Categories.Remove(category);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting category" });
        }
    }
}