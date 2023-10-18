using API.RequestHelpers.Common;

namespace API.RequestHelpers.EntitiyParams
{
    public class WorkerParams : PaginationParams
    {
        public string orderBy { get; set; }
        public string SearchTerm { get; set; }
        public string Duties { get; set; }
    }
}