using API.Entities.Base;

namespace API.Entities
{
    public class Worker : BaseEntity
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string PictureUrl { get; set; }
        public string PublicId { get; set; }
        public int DutyId { get; set; }
        public Duty Duty { get; set; }
    }
}