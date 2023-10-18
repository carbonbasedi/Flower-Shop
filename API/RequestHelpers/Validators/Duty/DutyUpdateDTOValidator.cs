using API.DTOs.Duty.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators.Duty
{
    public class DutyUpdateDTOValidator : AbstractValidator<DutyUpdateDTO>
    {
        public DutyUpdateDTOValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty();
        }
    }
}