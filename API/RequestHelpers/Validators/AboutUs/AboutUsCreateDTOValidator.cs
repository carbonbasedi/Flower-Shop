using API.DTOs.AboutUs;
using FluentValidation;

namespace API.RequestHelpers.Validators.AboutUs
{
    public class AboutUsCreateDTOValidator : AbstractValidator<AboutUsCreateDTO>
    {
        public AboutUsCreateDTOValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .MinimumLength(5)
                .MaximumLength(20);

            RuleFor(x => x.Subtitle)
                .NotEmpty()
                .MinimumLength(20)
                .MaximumLength(200);

            RuleFor(x => x.Description)
                .NotEmpty()
                .MinimumLength(50)
                .MaximumLength(300);

            RuleFor(x => x.File)
                .NotEmpty();
        }
    }
}