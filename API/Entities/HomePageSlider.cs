using API.Entities.Base;

namespace API.Entities
{
    public class HomePageSlider : BaseEntity
    {
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string PictureUrl { get; set; }
        public string ButtonLink { get; set; }
        public string PublicId { get; set; }
    }
}