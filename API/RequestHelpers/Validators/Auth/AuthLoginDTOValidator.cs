using API.DTOs.Auth.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators.Auth
{
    public class AuthLoginDTOValidator : AbstractValidator<LoginDTO>
    {
        public AuthLoginDTOValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty();

            RuleFor(x => x.Password.Length)
                .NotEmpty();
        }
    }
}