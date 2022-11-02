namespace MovieApp.Models
{
    public partial class Watchlist
    {
        public string WatchlistId { get; set; } = null!;
        public int UserId { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
