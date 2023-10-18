using API.DTOs.Worker.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators.Worker
{
    public class WorkerCreateDTOValidator : AbstractValidator<WorkerCreateDTO>
    {
        public WorkerCreateDTOValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty();

            RuleFor(x => x.Surname)
                .NotEmpty();

            RuleFor(x => x.File)
                .NotEmpty();

            RuleFor(x => x.DutyId)
                .NotEmpty();
        }
    }
}