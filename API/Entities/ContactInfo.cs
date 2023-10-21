using API.Entities.Base;

namespace API.Entities
{
    public class ContactInfo : BaseEntity
    {
        public string Address { get; set; }
        public string PhoneNumber1 { get; set; }
        public string PhoneNumber2 { get; set; }
        public string PhoneNumber3 { get; set; }
        public string WebAddress1 { get; set; }
        public string WebAddress2 { get; set; }
        public string WebAddress3 { get; set; }
        public string MapLocation { get; set; }
    }
}