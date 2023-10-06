using API.DTOs.Product.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators.Product
{
    public class ProductCreateDTOValidator : AbstractValidator<ProductCreateDTO>
    {
        public ProductCreateDTOValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Title is required");

            RuleFor(x => x.Name)
                .MinimumLength(10)
                .WithMessage("Title mustbe at least 10 characters");
        }
    }
}