using Microsoft.AspNetCore.Mvc;
using MovieApp.Interfaces;
using MovieApp.Models;

namespace MovieApp.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        readonly IUser _userService;

        public UserController(IUser userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        /// <param name="userData"></param>
        [HttpPost]
        public void Post([FromBody] UserMaster registrationData)
        {
            _userService.RegisterUser(registrationData);
        }

        /// <summary>
        /// Check the availability of the username
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        [HttpGet("{userName}")]
        public bool ValidateUserName(string userName)
        {
            return _userService.CheckUserNameAvailability(userName);
        }

    }
}
