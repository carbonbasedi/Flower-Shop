using API.DTOs.ContactInfo.Request;
using FluentValidation;

namespace API.RequestHelpers.Validators.ContactInfo
{
    public class ContactInfoUpdateDTOValidator : AbstractValidator<ContactInfoUpdateDTO>
    {
        public ContactInfoUpdateDTOValidator()
        {
            RuleFor(x => x.Address)
                .NotEmpty();

            RuleFor(x => x.PhoneNumber1)
                .NotEmpty()
                .Matches(@"^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$")
                .WithMessage("Provide at least one Phone Number");

            RuleFor(x => x.WebAddress1)
                .NotEmpty()
                .EmailAddress()
                .WithMessage("Provide at least one Web or Email address");

            RuleFor(x => x.MapLocation)
                .NotEmpty();
        }
    }
}