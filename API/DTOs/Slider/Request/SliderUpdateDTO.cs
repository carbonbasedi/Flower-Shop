namespace API.DTOs.Slider.Request
{
    public class SliderUpdateDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public IFormFile File { get; set; }
        public string ButtonLink { get; set; }
    }
}