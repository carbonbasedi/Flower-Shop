using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Slider.Request
{
    public class SliderCreateDTO
    {
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public IFormFile File { get; set; }
        public string ButtonLink { get; set; }
    }
}