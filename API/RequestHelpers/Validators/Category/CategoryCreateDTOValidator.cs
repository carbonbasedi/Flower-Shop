using API.DTOs.Category.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators.Category
{
    public class CategoryCreateDTOValidator : AbstractValidator<CategoryCreateDTO>
    {
        public CategoryCreateDTOValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty();
        }
    }
}