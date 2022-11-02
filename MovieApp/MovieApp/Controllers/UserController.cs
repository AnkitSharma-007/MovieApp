using Microsoft.AspNetCore.Mvc;
using MovieApp.Interfaces;
using MovieApp.Models;

namespace MovieApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        readonly IUser _userService;

        public UserController(IUser userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public void Post(UserMaster registrationData)
        {
            _userService.RegisterUser(registrationData);
        }

        [HttpGet("{userName}")]
        public bool ValidateUserName(string userName)
        {
            return _userService.CheckUserNameAvailability(userName);
        }

    }
}
