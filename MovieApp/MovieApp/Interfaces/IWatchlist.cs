namespace MovieApp.Interfaces
{
    public interface IWatchlist
    {
        Task ToggleWatchlistItem(int userId, int movieId);

        Task<string> GetWatchlistId(int userId);

        Task ClearWatchlist(int userId);
    }
}
