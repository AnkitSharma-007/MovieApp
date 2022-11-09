﻿using MovieApp.Models;

namespace MovieApp.Interfaces
{
    public interface IMovie
    {
        Task AddMovie(Movie movie);

        Task<List<Genre>> GetGenre();

        Task<List<Movie>> GetAllMovies();

        Task UpdateMovie(Movie movie);

        Task<string> DeleteMovie(int movieId);

        Task<List<Movie>> GetSimilarMovies(int movieId);

        Task<List<Movie>> GetMoviesAvailableInWatchlist(string watchlistID);
    }
}
