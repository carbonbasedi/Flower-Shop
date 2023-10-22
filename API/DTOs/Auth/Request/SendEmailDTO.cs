namespace API.DTOs.Auth.Request
{
    public class SendEmailDTO
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Message { get; set; }
    }
}