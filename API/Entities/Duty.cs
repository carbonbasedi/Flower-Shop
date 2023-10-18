using API.Entities.Base;

namespace API.Entities
{
    public class Duty : BaseEntity
    {
        public string Title { get; set; }
        public ICollection<Worker> Workers { get; set; }
    }
}