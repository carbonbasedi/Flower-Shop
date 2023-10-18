namespace API.DTOs.AboutUs
{
    public class AboutUsCreateDTO
    {
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public IFormFile File { get; set; }
    }
}