using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MovieApp.DataAccess;
using MovieApp.Interfaces;
using MovieApp.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "MovieApp API",
        Description = "An ASP.NET Core Web API for managing the movie data",
        Contact = new OpenApiContact
        {
            Name = "Ankit Sharma",
            Url = new Uri("https://ankitsharmablogs.com/"),
        },
        License = new OpenApiLicense
        {
            Name = "MIT Licenese",
            Url = new Uri("https://github.com/AnkitSharma-007/MovieApp/blob/main/LICENSE"),
        }
    });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Standard JWT Authorization header. Example: \"bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

// Add Service injection here
builder.Services.AddTransient<IMovie, MovieDataAccessLayer>();
builder.Services.AddTransient<IUser, UserDataAccessLayer>();
builder.Services.AddTransient<IWatchlist, WatchlistDataAccessLayer>();

builder.Services.AddDbContext<MovieDBContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
 .AddJwtBearer(options =>
 {
     options.RequireHttpsMetadata = false;
     options.SaveToken = true;
     options.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuer = true,
         ValidateAudience = true,
         ValidateLifetime = true,
         ValidateIssuerSigningKey = true,
         ValidIssuer = builder.Configuration["Jwt:Issuer"],
         ValidAudience = builder.Configuration["Jwt:Audience"],
         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"])),
         ClockSkew = TimeSpan.Zero // Override the default clock skew of 5 mins
     };

     builder.Services.AddCors();
 });

builder.Services.AddAuthorization(config =>
{
    config.AddPolicy(UserRoles.Admin, Policies.AdminPolicy());
    config.AddPolicy(UserRoles.User, Policies.UserPolicy());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

var FileProviderPath = app.Environment.WebRootPath + "/Poster";
if (!Directory.Exists(FileProviderPath))
{
    Directory.CreateDirectory(FileProviderPath);
}

app.UseFileServer(new FileServerOptions
{
    FileProvider = new PhysicalFileProvider(FileProviderPath),
    RequestPath = "/Poster",
    EnableDirectoryBrowsing = true
});

// The below code will enable swagger in localhost but NOT in PROD env.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
