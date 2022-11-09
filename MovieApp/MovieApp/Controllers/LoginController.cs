using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MovieApp.Dto;
using MovieApp.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MovieApp.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        readonly IUser _userService;
        readonly IConfiguration _config;

        public LoginController(IConfiguration config, IUser userService)
        {
            _config = config;
            _userService = userService;
        }

        [HttpPost]
        public IActionResult Login(UserLogin login)
        {
            IActionResult response = Unauthorized();
            AuthenticatedUser user = _userService.AuthenticateUser(login);

            if (user is not null)
            {
                var tokenString = GenerateJSONWebToken(user);
                response = Ok(new
                {
                    token = tokenString,
                    userDetails = user,
                });
            }

            return response;
        }

        string GenerateJSONWebToken(AuthenticatedUser userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            List<Claim> userClaims = new()
            {
                new Claim(ClaimTypes.Name, userInfo.Username),
                new Claim("userId", userInfo.UserId.ToString()),
                new Claim(ClaimTypes.Actor, userInfo.UserTypeName),
                new Claim(ClaimTypes.Role, userInfo.UserTypeName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: userClaims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
