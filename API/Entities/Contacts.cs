using API.Entities.Base;

namespace API.Entities
{
    public class Contacts : BaseEntity
    {
        public string Address { get; set; }
        public List<string> PhoneNumbers { get; set; }
        public List<string> WebAddress { get; set; }
        public string MapLocation { get; set; }

        public void AddPhoneNumber(string number)
        {
            PhoneNumbers.Add(number);
        }

        public void RemovePhoneNumber(string number)
        {
            PhoneNumbers.Remove(number);
        }

        public void AddWebAddress(string address)
        {
            PhoneNumbers.Add(address);
        }
    }
}