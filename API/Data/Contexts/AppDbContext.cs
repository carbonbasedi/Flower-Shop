using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Contexts
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions options) : base(options) { }

		public DbSet<Product> Products { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<Product>()
				.Property(p => p.Price)
				.HasColumnType("decimal(18,2)");

			base.OnModelCreating(modelBuilder);
		}
	}
}
