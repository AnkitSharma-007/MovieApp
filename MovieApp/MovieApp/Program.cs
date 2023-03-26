using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using MovieApp.DataAccess;
using MovieApp.Interfaces;
using MovieApp.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();

// Add Service injection here
builder.Services.AddTransient<IMovie, MovieDataAccessLayer>();
builder.Services.AddTransient<IUser, UserDataAccessLayer>();
builder.Services.AddTransient<IWatchlist, WatchlistDataAccessLayer>();


builder.Services.AddDbContext<MovieDBContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

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


//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

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

// We want to show the Swagger in the prod env also.
// Hence not including the below code under the `if (!app.Environment.IsDevelopment())` section.

//app.UseSwagger();
//app.UseSwaggerUI(options =>
//{
//    options.SwaggerEndpoint("/swagger/v1/swagger.json", "MovieApp API");
//    options.RoutePrefix = string.Empty;
//});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
