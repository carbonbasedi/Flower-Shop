using API.DTOs.Slider.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators
{
    public class SliderCreateDTOValidator : AbstractValidator<SliderCreateDTO>
    {
        public SliderCreateDTOValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .MaximumLength(20);

            RuleFor(x => x.Subtitle)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.ButtonLink)
                .NotEmpty()
                .MaximumLength(10);

            RuleFor(x => x.File)
                .NotEmpty();
        }
    }
}