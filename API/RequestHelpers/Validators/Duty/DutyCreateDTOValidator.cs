using API.DTOs.Duty.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators.Duty
{
    public class DutyCreateDTOValidator : AbstractValidator<DutyCreateDTO>
    {
        public DutyCreateDTOValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty();
        }
    }
}