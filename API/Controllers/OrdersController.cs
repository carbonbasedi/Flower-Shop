using API.Controllers.Base;
using API.Data;
using API.Data.Contexts;
using API.DTOs;
using API.DTOs.Order.Request;
using API.DTOs.Order.Response;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly AppDbContext _context;
        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("AdminOrdersList", Name = "GetAdminOrdersList")]
        public async Task<ActionResult<List<OrderDTO>>> GetAdminOrdersList()
        {
            return await _context.Orders
                        .Where(x => x.OrderStatus == OrderStatus.Pending && !x.isDelivered)
                        .ProjectOrderToOrderDTO()
                        .ToListAsync();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> SetOrderDelivered(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order is null) return NotFound();

            order.isDelivered = true;

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem occured" });
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDTO>>> GetOrders()
        {
            return await _context.Orders
                .ProjectOrderToOrderDTO()
                .Where(x => x.UserId == User.Identity.Name)
                .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            return await _context.Orders
                .ProjectOrderToOrderDTO()
                .Where(x => x.UserId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDTO orderDTO)
        {
            var basket = await _context.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if (basket == null) return BadRequest(new ProblemDetails { Title = "Couldn't locate the basket" });

            var items = new List<OrderItem>();

            foreach (var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);

                var itemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };

                var orderItem = new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    DiscountedPrice = item.Product.DiscountedPrice,
                    Quantity = item.Quantity
                };

                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }

            var subtotal = items.Sum(item => (item.DiscountedPrice ?? item.Price) * item.Quantity);
            var deliveryFee = subtotal > 100 ? 0 : 5;

            var order = new Order
            {
                OrderItems = items,
                UserId = User.Identity.Name,
                ShippingAddress = orderDTO.ShippingAddress,
                Subtotal = subtotal,
                DeliveryFee = deliveryFee,
                PaymentIntentId = basket.PaymentIntentId
            };

            _context.Orders.Add(order);

            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            if (orderDTO.SaveAddress)
            {
                var user = await _context.Users
                    .Include(a => a.Address)
                    .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                var address = new UserAddress
                {
                    Fullname = orderDTO.ShippingAddress.Fullname,
                    Address1 = orderDTO.ShippingAddress.Address1,
                    Address2 = orderDTO.ShippingAddress.Address2,
                    City = orderDTO.ShippingAddress.City,
                    State = orderDTO.ShippingAddress.State,
                    Zip = orderDTO.ShippingAddress.Zip,
                    Country = orderDTO.ShippingAddress.Country
                };
                user.Address = address;
            }
            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);

            return BadRequest("Problem creating order");
        }
    }
}