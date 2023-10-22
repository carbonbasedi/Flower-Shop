using API.Data.Contexts;
using API.Entities;
using API.Entities.Constants;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
	public class DbInitializer
	{
		public async static Task SeedAsync(RoleManager<IdentityRole> roleManager, UserManager<User> userManager, AppDbContext context)
		{
			await SeedRolesAsync(roleManager);
			await SeedUsersAsync(userManager);
			Initialize(context);
			InitializeWorker(context);
			InitializeHome(context);
			InitializeAboutUs(context);
			InitializeAddress(context);
		}

		private async static Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
		{
			foreach (var role in Enum.GetValues<UserRoles>())
			{
				if (!await roleManager.RoleExistsAsync(role.ToString()))
				{
					await roleManager.CreateAsync(new IdentityRole
					{
						Name = role.ToString(),
					});
				}
			}
		}

		private async static Task SeedUsersAsync(UserManager<User> userManager)
		{
			var user = await userManager.FindByNameAsync("Admin");
			if (user is null)
			{
				user = new User
				{
					UserName = "Admin",
					Email = "admin@gmail.com"
				};

				var result = await userManager.CreateAsync(user, "Admin123!");

				if (!result.Succeeded)
				{
					foreach (var error in result.Errors)
						throw new Exception(error.Description);
				}

				await userManager.AddToRoleAsync(user, UserRoles.Admin.ToString());
			}
		}

		public static void InitializeAddress(AppDbContext context)
		{
			if (context.ContactInfo.Any()) return;

			var contactInfo = new ContactInfo
			{
				Address = "203 Nizami St, Baku 1010",
				MapLocation = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5111.666993940134!2d49.84785327470385!3d40.377488382505206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d079efb5163%3A0xc20aa51a5f0b5e01!2sCode%20Academy!5e0!3m2!1sen!2saz!4v1697995937598!5m2!1sen!2saz",
				PhoneNumber1 = "+994123214565",
				PhoneNumber2 = "+994501236545",
				PhoneNumber3 = "+994557412585",
				WebAddress1 = "admin@flower-shop.com",
				WebAddress2 = "manager@flower-shop.com",
				WebAddress3 = "worker@flower-shop.com",
			};
			context.ContactInfo.Add(contactInfo);
			context.SaveChanges();
		}

		public static void InitializeAboutUs(AppDbContext context)
		{
			if (context.AboutUs.Any()) return;

			var aboutUs = new AboutUs
			{
				Title = "Our Goal",
				Subtitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Vestibulum ",
				Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget est eu augue tempor malesuada. Curabitur vel libero at sapien tristique feugiat.",
				PictureUrl = "images/aboutus.jpg",

			};
			context.AboutUs.Add(aboutUs);
			context.SaveChanges();
		}

		private static void InitializeHome(AppDbContext context)
		{
			if (context.Sliders.Any()) return;

			var sliders = new List<HomePageSlider>
			{
				new HomePageSlider
				{
					Title = "Welcome to our shop",
					Subtitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget est eu augue tempor malesuada. Curabitur vel libero at sapien tristique feugiat",
					PictureUrl = "/images/flowershop-slider.png",
					ButtonLink = "Shop Now"
				},
				new HomePageSlider
				{
					Title = "Shocking discounts",
					Subtitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget est eu augue tempor malesuada. Curabitur vel libero at sapien tristique feugiat",
					PictureUrl = "/images/flowershop-slider-2.jpg",
					ButtonLink = "Catalog"
				}
			};
			foreach (var slider in sliders)
			{
				context.Sliders.Add(slider);
			}
			context.SaveChanges();
		}

		private static void InitializeWorker(AppDbContext context)
		{
			if (context.Workers.Any()) return;

			var workers = new List<Worker>
			{
				new Worker
				{
					Name = "John",
					Surname = "Doe",
					DutyId = 8,
					PictureUrl = "/images/worker/worker1.jpg",
				},
				new Worker
				{
					Name = "John",
					Surname = "Doe",
					DutyId = 10,
					PictureUrl = "/images/worker/worker2.jpg",
				},
				new Worker
				{
					Name = "John",
					Surname = "Doe",
					DutyId = 9,
					PictureUrl = "/images/worker/worker3.jpg",
				},
				new Worker
				{
					Name = "John",
					Surname = "Doe",
					DutyId = 8,
					PictureUrl = "/images/worker/worker4.jpg",
				},
				new Worker
				{
					Name = "John",
					Surname = "Doe",
					DutyId = 10,
					PictureUrl = "/images/worker/worker5.jpg",
				},
				new Worker
				{
					Name = "John",
					Surname = "Doe",
					DutyId = 9,
					PictureUrl = "/images/worker/worker6.jpg",
				},
				new Worker
				{
					Name = "John",
					Surname = "Doe",
					DutyId = 8,
					PictureUrl = "/images/worker/worker7.jpg",
				},
			};
			foreach (var worker in workers)
			{
				context.Workers.Add(worker);
			}
			context.SaveChanges();
		}
		private static void Initialize(AppDbContext context)
		{
			if (context.Products.Any()) return;

			var products = new List<Product>
			{
				new Product
				{
					Name = "Amarllys",
					Description =
						"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
					Price = 75m,
					PictureUrl = "/images/products/flower-2.webp",
					QuantityInStock = 100,
					CategoryId = 1,
					Discount = 5,
					isFeatured = true
				},
				new Product
				{
					Name = "Lion Heart",
					Description = "Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
					Price = 37.12m,
					PictureUrl = "/images/products/flower-1.webp",
					QuantityInStock = 100,
					CategoryId = 1
				},
				new Product
				{
					Name = "Bassica",
					Description =
						"Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
					Price = 100.15m,
					PictureUrl = "/images/products/flower-8.webp",
					QuantityInStock = 100,
					CategoryId = 2,
					Discount = 10,
					isFeatured = true

				},
				new Product
				{
					Name = "Bacardi yellow",
					Description =
						"Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
					Price = 10.10m,
					PictureUrl = "/images/products/flower-7.webp",
					QuantityInStock = 100,
					CategoryId = 2,
					Discount = 15
				},
				new Product
				{
					Name = "Limoncello",
					Description =
						"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
					Price = 55.90m,
					PictureUrl = "/images/products/flower-6.webp",
					QuantityInStock = 100,
					CategoryId = 3,
					isFeatured = true
				},
				new Product
				{
					Name = "Begonia",
					Description =
						"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
					Price = 130m,
					PictureUrl = "/images/products/flower-5.webp",
					QuantityInStock = 100,
					CategoryId = 3,
					Discount = 65
				},
				new Product
				{
					Name = "Tulips",
					Description =
						"Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
					Price = 60m,
					PictureUrl = "/images/products/flower-4.webp",
					QuantityInStock = 100,
					CategoryId = 1,
					isFeatured = true
				},
				new Product
				{
					Name = "Green Monster",
					Description =
						"Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
					Price = 50m,
					PictureUrl = "/images/products/flower-3.webp",
					QuantityInStock = 100,
					CategoryId = 1,
					Discount = 25
				},
				new Product
				{
					Name = "Saint Luis",
					Description =
						"Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
					Price = 55m,
					PictureUrl = "/images/products/flower-2.webp",
					QuantityInStock = 100,
					CategoryId = 2,
					isFeatured = true
				},
				new Product
				{
					Name = "Gerbera",
					Description =
						"Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
					Price = 250m,
					PictureUrl = "/images/products/flower-1.webp",
					QuantityInStock = 100,
					CategoryId = 2,
					Discount = 5
				},
				new Product
				{
					Name = "Anthurium",
					Description =
						"Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
					Price = 35.15m,
					PictureUrl = "/images/products/flower-8.webp",
					QuantityInStock = 100,
					CategoryId = 3,
					isFeatured = true
				},
				new Product
				{
					Name = "Dragon flower",
					Description =
						"Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
					Price = 75.15m,
					PictureUrl = "/images/products/flower-7.webp",
					QuantityInStock = 100,
					CategoryId = 3,
					Discount = 5,
					isFeatured = true
				},
				new Product
				{
					Name = "Buxus Square",
					Description =
						"Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
					Price = 90.15m,
					PictureUrl = "/images/products/flower-6.webp",
					QuantityInStock = 100,
					CategoryId = 1
				},
				new Product
				{
					Name = "Saint Pauila",
					Description =
						"Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
					Price = 125m,
					PictureUrl = "/images/products/flower-5.webp",
					QuantityInStock = 100,
					CategoryId = 1,
					Discount = 10,
					isFeatured = true
				},
				new Product
				{
					Name = "Freesia",
					Description =
						"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
					Price = 80.00m,
					PictureUrl = "/images/products/flower-4.webp",
					QuantityInStock = 100,
					CategoryId = 2
				},
				new Product
				{
					Name = "Delphinium",
					Description =
						"Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
					Price = 65.55m,
					PictureUrl = "/images/products/flower-3.webp",
					QuantityInStock = 100,
					CategoryId = 2
				},
				new Product
				{
					Name = "Campbellium",
					Description = "Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.",
					Price = 100.25m,
					PictureUrl = "/images/products/flower-2.webp",
					QuantityInStock = 100,
					CategoryId = 3
				},
				new Product
				{
					Name = "Zantedechsia",
					Description =
						"Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
					Price = 120.15m,
					PictureUrl = "/images/products/flower-1.webp",
					QuantityInStock = 100,
					CategoryId = 3,
					Discount = 40
				},
			};
			foreach (var product in products)
			{
				context.Products.Add(product);
			}
			context.SaveChanges();
		}
	}
}
