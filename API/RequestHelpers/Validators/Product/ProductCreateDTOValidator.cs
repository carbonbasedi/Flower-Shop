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
               .MaximumLength(20);

            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(150);

            RuleFor(x => x.Price)
                .NotEmpty()
                .GreaterThan(0);

            RuleFor(x => x.QuantityInStock)
                .NotEmpty()
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.File)
                .NotEmpty();

            RuleFor(x => x.CategoryId)
                .NotEmpty();
        }
    }
}