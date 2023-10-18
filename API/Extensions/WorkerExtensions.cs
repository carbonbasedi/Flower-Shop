using API.Entities;

namespace API.Extensions
{
    public static class WorkerExtensions
    {
        public static IQueryable<Worker> Search(this IQueryable<Worker> query, string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm)) return query.OrderBy(p => p.Name);

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm) ||
                                p.Surname.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<Worker> Filter(this IQueryable<Worker> query, string duties)
        {
            var dutyList = new List<string>();

            if (!string.IsNullOrEmpty(duties))
                dutyList.AddRange(duties.ToLower().Split(',').ToList());

            query = query.Where(p => dutyList.Count == 0 || dutyList.Contains(p.Duty.Title.ToLower()));

            return query;
        }
    }
}