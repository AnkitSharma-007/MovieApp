using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieApp.Interfaces;
using MovieApp.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MovieApp.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WatchlistController : ControllerBase
    {
        readonly IWatchlist _watchlistService;
        readonly IMovie _movieService;
        readonly IUser _userService;

        public WatchlistController(IWatchlist watchlistService, IMovie movieService, IUser userService)
        {
            _watchlistService = watchlistService;
            _movieService = movieService;
            _userService = userService;
        }

        [HttpGet("{userId}")]
        public async Task<List<Movie>> Get(int userId)
        {
            return await GetUserWatchlist(userId);
        }

        [HttpPost]
        [Route("ToggleWatchlist/{userId}/{movieId}")]
        public async Task<List<Movie>> Get(int userId, int movieId)
        {
            await _watchlistService.ToggleWatchlistItem(userId, movieId);
            return await GetUserWatchlist(userId);
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> Delete(int userId)
        {
            await _watchlistService.ClearWatchlist(userId);
            return Ok();
        }

        async Task<List<Movie>> GetUserWatchlist(int userId)
        {
            bool user = await _userService.IsUserExists(userId);
            if (user)
            {
                string watchlistid = await _watchlistService.GetWatchlistId(userId);
                return await _movieService.GetMoviesAvailableInWatchlist(watchlistid);
            }
            else
            {
                return new List<Movie>();
            }
        }

    }
}
