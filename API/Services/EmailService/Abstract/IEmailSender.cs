namespace API.Services.EmailService.Abstract
{
    public interface IEmailSender
    {
        void SendEmail(Message message);
    }
}