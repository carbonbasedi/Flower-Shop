using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Contexts
{
	public class AppDbContext : IdentityDbContext<User>
	{
		public AppDbContext(DbContextOptions options) : base(options) { }

		public DbSet<Product> Products { get; set; }
		public DbSet<Basket> Baskets { get; set; }
		public DbSet<Order> Orders { get; set; }
		public DbSet<HomePageSlider> Sliders { get; set; }
		public DbSet<AboutUs> AboutUs { get; set; }
		public DbSet<Duty> Duties { get; set; }
		public DbSet<Worker> Workers { get; set; }
		public DbSet<Category> Categories { get; set; }
		public DbSet<ContactInfo> ContactInfo { get; set; }
		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<Product>()
				.Property(p => p.Price)
				.HasColumnType("decimal(18,2)");

			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<Product>()
				.Property(p => p.DiscountedPrice)
				.HasColumnType("decimal(18,2)");

			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<User>()
				.HasOne(a => a.Address)
				.WithOne()
				.HasForeignKey<UserAddress>(a => a.Id)
				.OnDelete(DeleteBehavior.Cascade);

			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<OrderItem>()
				.Property(p => p.Price)
				.HasColumnType("decimal(18,2)");
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<OrderItem>()
				.Property(p => p.DiscountedPrice)
				.HasColumnType("decimal(18,2)");
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<Order>()
				.Property(p => p.Subtotal)
				.HasColumnType("decimal(18,2)");

			modelBuilder.Entity<Order>()
				.Property(p => p.DeliveryFee)
				.HasColumnType("decimal(18,2)");
			base.OnModelCreating(modelBuilder);

		}
	}
}
