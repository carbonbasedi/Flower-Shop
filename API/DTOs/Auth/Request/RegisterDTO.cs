namespace API.DTOs.Auth.Request
{
    public class RegisterDTO : LoginDTO
    {
        public string Email { get; set; }
    }
}