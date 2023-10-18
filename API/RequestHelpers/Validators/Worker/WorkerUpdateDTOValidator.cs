using API.DTOs.Worker.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators.Worker
{
    public class WorkerUpdateDTOValidator : AbstractValidator<WorkerUpdateDTO>
    {
        public WorkerUpdateDTOValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty();

            RuleFor(x => x.Surname)
                .NotEmpty();
        }
    }
}