using Microsoft.AspNetCore.Mvc;
using MovieApp.Interfaces;
using MovieApp.Models;
using Newtonsoft.Json;
using System.Net.Http.Headers;

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

        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> Post()
        {
            Movie? movie = JsonConvert.DeserializeObject<Movie>(Request.Form["movieFormData"].ToString());

            if (movie is not null)
            {

                if (Request.Form.Files.Count > 0)
                {
                    var file = Request.Form.Files[0];

                    if (file.Length > 0)
                    {
                        string fileName = $"{Guid.NewGuid()}{ContentDispositionHeaderValue.Parse(file.ContentDisposition)?.FileName?.Trim('"')}";
                        string fullPath = Path.Combine(posterFolderPath, fileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                        movie.PosterPath = fileName;
                    }
                }
                else
                {
                    movie.PosterPath = _config["DefaultPoster"];

                }

                await _movieService.AddMovie(movie);
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPut]
        public async Task<IActionResult> Put()
        {
            Movie? movie = JsonConvert.DeserializeObject<Movie>(Request.Form["movieFormData"].ToString());

            if (movie is not null)
            {
                if (Request.Form.Files.Count > 0)
                {
                    var file = Request.Form.Files[0];

                    if (file.Length > 0)
                    {
                        string fileName = $"{Guid.NewGuid()}{ContentDispositionHeaderValue.Parse(file.ContentDisposition)?.FileName?.Trim('"')}";
                        string fullPath = Path.Combine(posterFolderPath, fileName);
                        bool isFileExists = Directory.Exists(fullPath);

                        if (!isFileExists)
                        {
                            using (var stream = new FileStream(fullPath, FileMode.Create))
                            {
                                file.CopyTo(stream);
                            }
                            movie.PosterPath = fileName;
                        }
                    }
                }
                await _movieService.UpdateMovie(movie);
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

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
    }
}
