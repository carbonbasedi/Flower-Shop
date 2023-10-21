using API.DTOs.Category.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators.Category
{
    public class CategoryUpdateDTOValidator : AbstractValidator<CategoryUpdateDTO>
    {
        public CategoryUpdateDTOValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty();
        }
    }
}