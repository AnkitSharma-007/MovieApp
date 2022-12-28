using Microsoft.EntityFrameworkCore;
using MovieApp.Interfaces;
using MovieApp.Models;

namespace MovieApp.DataAccess
{
    public class WatchlistDataAccessLayer : IWatchlist
    {
        readonly MovieDBContext _dbContext;

        public WatchlistDataAccessLayer(MovieDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<string> GetWatchlistId(int userId)
        {
            try
            {
                Watchlist? watchlist = await _dbContext.Watchlists.FirstOrDefaultAsync(x => x.UserId == userId);

                if (watchlist is not null)
                {
                    return watchlist.WatchlistId;
                }
                else
                {
                    return await CreateWatchlist(userId);
                }

            }
            catch
            {
                throw;
            }
        }

        public async Task ToggleWatchlistItem(int userId, int movieId)
        {
            string watchlistId = await GetWatchlistId(userId);

            WatchlistItem? existingWatchlistItem = await _dbContext.WatchlistItems
                .FirstOrDefaultAsync(x => x.MovieId == movieId && x.WatchlistId == watchlistId);

            if (existingWatchlistItem is not null)
            {
                _dbContext.WatchlistItems.Remove(existingWatchlistItem);
            }
            else
            {
                WatchlistItem watchlistItem = new()
                {
                    WatchlistId = watchlistId,
                    MovieId = movieId,
                };

                _dbContext.WatchlistItems.Add(watchlistItem);
            }
            await _dbContext.SaveChangesAsync();
        }

        public async Task ClearWatchlist(int userId)
        {
            try
            {
                string watchlistId = await GetWatchlistId(userId);
                List<WatchlistItem> watchlistItem = _dbContext.WatchlistItems.Where(x => x.WatchlistId == watchlistId).ToList();

                if (!string.IsNullOrEmpty(watchlistId))
                {
                    foreach (WatchlistItem item in watchlistItem)
                    {
                        _dbContext.WatchlistItems.Remove(item);
                        _dbContext.SaveChanges();
                    }
                }
            }
            catch
            {
                throw;
            }
        }

        async Task<string> CreateWatchlist(int userId)
        {
            try
            {
                Watchlist watchlist = new()
                {
                    WatchlistId = Guid.NewGuid().ToString(),
                    UserId = userId,
                    DateCreated = DateTime.Now.Date
                };

                await _dbContext.Watchlists.AddAsync(watchlist);
                await _dbContext.SaveChangesAsync();

                return watchlist.WatchlistId;
            }
            catch
            {
                throw;
            }
        }
    }
}
