using Microsoft.AspNetCore.Mvc;
using MovieApp.Interfaces;
using MovieApp.Models;
using Newtonsoft.Json;

namespace MovieApp.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        readonly IWebHostEnvironment _hostingEnvironment;
        readonly IMovie _movieService;
        readonly IConfiguration _config;
        readonly string posterFolderPath = string.Empty;

        public MovieController(IConfiguration config, IWebHostEnvironment hostingEnvironment, IMovie movieService)
        {
            _config = config;
            _movieService = movieService;
            _hostingEnvironment = hostingEnvironment;
            posterFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "Poster");
        }

        // GET api/<MovieController>/5
        [HttpGet]
        public async Task<List<Movie>> Get()
        {
            return await _movieService.GetAllMovies();
        }

        [HttpGet]
        [Route("GetGenreList")]
        public async Task<IEnumerable<Genre>> GenreList()
        {
            return await _movieService.GetGenre();
        }

        [HttpGet]
        [Route("GetSimilarMovies/{movieId}")]
        public async Task<List<Movie>> SimilarMovies(int movieId)
        {
            return await _movieService.GetSimilarMovies(movieId);
        }

        // POST api/<MovieController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
            // Decide if you want to use BookCart technique or the Blazor MovieApp technique
            //  Movie movie = JsonConvert.DeserializeObject<Movie>(Request.Form["movieFormData"].ToString());
        }

        // PUT api/<MovieController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<MovieController>/5
        [HttpDelete("{movieId}")]
        public async Task<IActionResult> Delete(int movieId)
        {
            string coverFileName = await _movieService.DeleteMovie(movieId);

            if (!string.IsNullOrEmpty(coverFileName) && coverFileName != _config["DefaultPoster"])
            {
                string fullPath = Path.Combine(posterFolderPath, coverFileName);
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
            return Ok();
        }

        static bool CheckBase64String(string base64)
        {
            Span<byte> buffer = new(new byte[base64.Length]);
            return Convert.TryFromBase64String(base64, buffer, out int bytesParsed);
        }
    }
}
