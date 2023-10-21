using API.Entities.Base;

namespace API.Entities
{
    public class Category : BaseEntity
    {
        public string Title { get; set; }
        public ICollection<Product> Products { get; set; }
    }
}