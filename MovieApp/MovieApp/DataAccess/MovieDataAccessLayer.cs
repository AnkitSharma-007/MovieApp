﻿using Microsoft.EntityFrameworkCore;
using MovieApp.Interfaces;
using MovieApp.Models;

namespace MovieApp.DataAccess
{
    public class MovieDataAccessLayer : IMovie
    {
        readonly MovieDBContext _dbContext;

        public MovieDataAccessLayer(MovieDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddMovie(Movie movie)
        {
            try
            {
                await _dbContext.Movies.AddAsync(movie);
                await _dbContext.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> DeleteMovie(int movieId)
        {
            try
            {
                Movie? movie = await GetMovieData(movieId);

                if (movie is not null)
                {
                    _dbContext.Movies.Remove(movie);
                    await _dbContext.SaveChangesAsync();

                    // Check this condition by deleting a movie with no poster, since poster is an optional field.
                    return movie.PosterPath;
                }

                return string.Empty;
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<Movie>> GetAllMovies()
        {
            return await _dbContext.Movies.AsNoTracking().ToListAsync();
        }

        public async Task<List<Genre>> GetGenre()
        {
            return await _dbContext.Genres.AsNoTracking().ToListAsync();
        }

        public async Task<List<Movie>> GetMoviesAvailableInWatchlist(string watchlistID)
        {
            try
            {
                List<Movie> userWatchlist = new();
                List<WatchlistItem> watchlistItems =
                    _dbContext.WatchlistItems.Where(x => x.WatchlistId == watchlistID).ToList();

                foreach (WatchlistItem item in watchlistItems)
                {
                    Movie? movie = await GetMovieData(item.MovieId);

                    if (movie is not null)
                    {
                        userWatchlist.Add(movie);
                    }
                }
                return userWatchlist;
            }
            catch
            {
                throw;
            }
        }

        public async Task UpdateMovie(Movie movie)
        {
            try
            {
                Movie? oldMovieData = await GetMovieData(movie.MovieId);

                if (oldMovieData?.PosterPath is not null)
                {
                    if (movie.PosterPath is null)
                    {
                        movie.PosterPath = oldMovieData.PosterPath;
                    }
                }
                _dbContext.Entry(movie).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<Movie>> GetSimilarMovies(int movieId)
        {
            List<Movie> lstMovie = new();
            Movie? movie = await _dbContext.Movies.FindAsync(movieId);

            if (movie is not null)
            {
                lstMovie = _dbContext.Movies.Where(m => m.Genre == movie.Genre && m.MovieId != movie.MovieId)
                .OrderBy(u => Guid.NewGuid())
                .Take(5)
                .ToList();
            }
            return lstMovie;
        }

        async Task<Movie?> GetMovieData(int movieId)
        {
            try
            {
                Movie? movie = await _dbContext.Movies.FindAsync(movieId);

                if (movie is not null)
                {
                    _dbContext.Entry(movie).State = EntityState.Detached;
                }

                return movie;
            }
            catch
            {
                throw;
            }
        }
    }
}
