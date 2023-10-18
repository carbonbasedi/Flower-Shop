using API.DTOs.Worker.Response;

namespace API.DTOs.Duty.Response
{
    public class DutyDTO
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public string Title { get; set; }
        public List<WorkerDTO> Workers { get; set; }
    }
}