using API.Entities;

namespace API.DTOs.Worker.Response
{
    public class WorkerDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string PictureUrl { get; set; }
        public int DutyId { get; set; }
        public string Duty { get; set; }
    }
}