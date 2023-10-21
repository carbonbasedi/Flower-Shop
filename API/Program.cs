using System.Text;
using API.Data;
using API.Data.Contexts;
using API.Entities;
using API.Middleware;
using API.RequestHelpers.MappingProfiles;
using API.Services;
using API.Services.EmailService;
using API.Services.EmailService.Abstract;
using API.Services.EmailService.Concrete;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
	var jwtSecurityScheme = new OpenApiSecurityScheme
	{
		BearerFormat = "JWT",
		Name = "Authorization",
		In = ParameterLocation.Header,
		Type = SecuritySchemeType.ApiKey,
		Scheme = JwtBearerDefaults.AuthenticationScheme,
		Description = "Put Bearer + your token in the box down below",
		Reference = new OpenApiReference
		{
			Id = JwtBearerDefaults.AuthenticationScheme,
			Type = ReferenceType.SecurityScheme
		}
	};

	c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

	c.AddSecurityRequirement(new OpenApiSecurityRequirement
	{
		{
			jwtSecurityScheme,Array.Empty<string>()
		}
	});
});

builder.Services.AddDbContext<AppDbContext>(x => x.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddCors();
builder.Services.AddIdentity<User, IdentityRole>(opt =>
{
	opt.User.RequireUniqueEmail = true;
	opt.SignIn.RequireConfirmedEmail = true;
})
	.AddEntityFrameworkStores<AppDbContext>()
	.AddDefaultTokenProviders();

builder.Services.AddAutoMapper(x =>
{
	x.AddProfile(new ProductMappingProfile());
	x.AddProfile(new SliderMappingProfile());
	x.AddProfile(new AboutUsMappingProfile());
	x.AddProfile(new DutyMappingProfile());
	x.AddProfile(new WorkerMappingProfile());
	x.AddProfile(new CategoryMappingProfile());
	x.AddProfile(new ContactInfoMappingProfile());
});

builder.Services.AddAuthentication(opt =>
{
	opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
	opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
	.AddJwtBearer(opt =>
	{
		opt.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = false,
			ValidateAudience = false,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
		};
	});

builder.Services.AddAuthorization();
builder.Services.AddScoped<ImageService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<PaymentService>();

builder.Services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
var configuration = builder.Configuration.GetSection("EmailConfiguration").Get<EmailConfiguration>();
builder.Services.AddSingleton(configuration);
builder.Services.AddSingleton<IEmailSender, EmailSender>();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI(c =>
	{
		c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
	});
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors(opt =>
{
	opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
	try
	{
		var roleManager = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();
		var userManager = scope.ServiceProvider.GetService<UserManager<User>>();
		var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
		await context.Database.MigrateAsync();
		await DbInitializer.SeedAsync(roleManager, userManager, context);
	}
	catch (Exception ex)
	{
		var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
		logger.LogError(ex, "Problem occured during migration");
	}

app.Run();
