using API.Entities;

namespace API.Extensions
{
    public static class SliderExtensions
    {
        public static IQueryable<HomePageSlider> Sort(this IQueryable<HomePageSlider> query, string orderBy)
        {
            if (string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Title);

            query = orderBy switch
            {
                "date" => query.OrderBy(p => p.CreatedAt),
                "dateDesc" => query.OrderByDescending(p => p.CreatedAt),
                _ => query.OrderBy(p => p.Title)
            };

            return query;
        }
    }
}