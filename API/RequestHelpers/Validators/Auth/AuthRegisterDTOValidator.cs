using API.DTOs.Auth.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators.Auth
{
    public class AuthRegisterDTOValidator : AbstractValidator<RegisterDTO>
    {
        public AuthRegisterDTOValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Username)
                .NotEmpty();

            RuleFor(x => x.Password.Length)
                .NotEmpty()
                .GreaterThanOrEqualTo(8);
        }
    }
}