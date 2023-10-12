using API.Entities.Base;

namespace API.Entities
{
    public class AboutUs : BaseEntity
    {
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public string PictureUrl { get; set; }
        public string PublicId { get; set; }
    }
}