using System.Text.RegularExpressions;
using API.Controllers.Base;
using API.Data.Contexts;
using API.DTOs.Auth.Request;
using API.DTOs.Auth.Response;
using API.Entities;
using API.Extensions;
using API.RequestHelpers.Validators.Auth;
using API.Services;
using API.Services.EmailService;
using API.Services.EmailService.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly AppDbContext _context;
        private readonly IEmailSender _emailSender;
        private readonly IActionContextAccessor _contextAccessor;
        private readonly IUrlHelperFactory _urlHelperFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly TokenService _tokenService;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public AccountController(UserManager<User> userManager,
                                 SignInManager<User> signInManager,
                                 RoleManager<IdentityRole> roleManager,
                                 TokenService tokenService,
                                 AppDbContext context,
                                 IEmailSender emailSender,
                                 IActionContextAccessor contextAccessor,
                                 IUrlHelperFactory urlHelperFactory,
                                 IHttpContextAccessor httpContextAccessor)
        {
            _roleManager = roleManager;
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _context = context;
            _emailSender = emailSender;
            _contextAccessor = contextAccessor;
            _urlHelperFactory = urlHelperFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _userManager.FindByNameAsync(loginDTO.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDTO.Password))
            {
                return Unauthorized();
            }
            if (!user.EmailConfirmed)
            {
                return BadRequest(new ProblemDetails { Title = "Email not confirmed" });
            }

            var result = await _signInManager.PasswordSignInAsync(user, loginDTO.Password, false, false);
            if (!result.Succeeded)
            {
                return Unauthorized();
            }
            var userBasket = await RetrieveBasket(loginDTO.Username);
            var anonBasket = await RetrieveBasket(Request.Cookies["userId"]);

            if (anonBasket != null)
            {
                if (userBasket != null) _context.Baskets.Remove(anonBasket);
                anonBasket.UserId = user.UserName;
                Response.Cookies.Delete("userId");
                await _context.SaveChangesAsync();
            }

            return new UserDTO
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = anonBasket != null ? anonBasket.MapBasketToDTO() : userBasket?.MapBasketToDTO()
            };
        }

        [HttpGet("logout")]
        public async Task<ActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDTO registerDTO)
        {
            var user = new User { UserName = registerDTO.Username, Email = registerDTO.Email };
            var result = await _userManager.CreateAsync(user, registerDTO.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }

            var urlHelper = _urlHelperFactory.GetUrlHelper(_contextAccessor.ActionContext);
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = urlHelper.Action(nameof(ConfirmEmail), "account", new { token, email = user.Email }, _httpContextAccessor.HttpContext.Request.Scheme);

            var message = new Message(new string[] { user.Email }, "P331 Email Confirmation", confirmationLink);
            _emailSender.SendEmail(message);


            await _userManager.AddToRoleAsync(user, "User");
            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var userBasket = await RetrieveBasket(User.Identity.Name);

            return new UserDTO
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDTO()
            };
        }

        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress()
        {
            return await _userManager.Users
                .Where(x => x.UserName == User.Identity.Name)
                .Select(user => user.Address)
                .FirstOrDefaultAsync();
        }

        [HttpGet("confirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("No such user found");

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded) return BadRequest("Something went wrong");

            return Ok();
        }

        [HttpPost("forgotPassword")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDTO forgotPasswordDTO)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordDTO.Email);
            if (user is null) return NotFound("No such user found");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var urlHelper = _urlHelperFactory.GetUrlHelper(_contextAccessor.ActionContext);
            var resetLink = urlHelper.Action(nameof(ResetPasswordGet), "account", new { token, email = user.Email }, _httpContextAccessor.HttpContext.Request.Scheme);

            var message = new Message(new string[] { user.Email }, "Reset password", resetLink);
            _emailSender.SendEmail(message);

            return Ok("Password reset link sent");
        }

        [HttpGet("resetPasswordGet")]
        public ActionResult<ResetPasswordDTO> ResetPasswordGet(string token, string email)
        {
            var dto = new ResetPasswordDTO
            {
                Email = email,
                Token = token
            };
            return dto;
        }

        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO resetPasswordDTO)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDTO.Email);
            if (user is null) return Ok();

            var result = await _userManager.ResetPasswordAsync(user, resetPasswordDTO.Token, resetPasswordDTO.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }

            return Ok();
        }

        [HttpPost("sendEmail")]
        public async Task<IActionResult> SendEmail(SendEmailDTO sendEmailDTO)
        {
            var vResult = await new SendEmailDTOValidator().ValidateAsync(sendEmailDTO);
            if (!vResult.IsValid)
            {
                foreach (var error in vResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.ErrorMessage);
                }
                return ValidationProblem();
            }

            var message = new Message(new string[] { "ruslan.mirzezade.21@gmail.com" }, $"Message from {sendEmailDTO.Email} {sendEmailDTO.Name} ", sendEmailDTO.Message);
            _emailSender.SendEmail(message);

            return Ok("Message sent");
        }

        private async Task<Basket> RetrieveBasket(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                Response.Cookies.Delete("userId");
                return null;
            }

            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }

        private static bool isPassword(string password)
        {
            return Regex.IsMatch(password, @"^(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$");
        }
    }
}