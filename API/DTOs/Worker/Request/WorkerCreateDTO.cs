using Microsoft.AspNetCore.Mvc.Rendering;

namespace API.DTOs.Worker.Request
{
    public class WorkerCreateDTO
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public int DutyId { get; set; }
        public IFormFile File { get; set; }
    }
}