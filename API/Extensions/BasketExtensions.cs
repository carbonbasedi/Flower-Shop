using API.DTOs.Basket.Request;
using API.DTOs.Basket.Response;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
	public static class BasketExtensions
	{
		public static BasketDTO MapBasketToDTO(this Basket basket)
		{
			return new BasketDTO
			{
				Id = basket.Id,
				UserId = basket.UserId,
				PaymentIntentId = basket.PaymentIntentId,
				ClientSecret = basket.ClientSecret,
				Items = basket.Items.Select(item => new BasketItemDTO
				{
					ProductId = item.ProductId,
					Name = item.Product.Name,
					Price = item.Product.Price,
					DiscountedPrice = item.Product.DiscountedPrice,
					PictureUrl = item.Product.PictureUrl,
					Quantity = item.Quantity
				}).ToList()
			};
		}

		public static IQueryable<Basket> RetrieveBasketWithItems(this IQueryable<Basket> query, string userId)
		{
			return query.Include(i => i.Items).ThenInclude(p => p.Product).Where(b => b.UserId == userId);
		}
	}
}