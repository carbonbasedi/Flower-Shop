using API.DTOs.Slider.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators.Slider
{
    public class SliderUpdateDTOValidator : AbstractValidator<SliderUpdateDTO>
    {
        public SliderUpdateDTOValidator()
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
        }
    }
}