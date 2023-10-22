using API.DTOs.Auth.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators.Auth
{
    public class SendEmailDTOValidator : AbstractValidator<SendEmailDTO>
    {
        public SendEmailDTOValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty();

            RuleFor(x => x.Email)
                .EmailAddress()
                .NotEmpty();

            RuleFor(x => x.Message)
                .NotEmpty();
        }
    }
}