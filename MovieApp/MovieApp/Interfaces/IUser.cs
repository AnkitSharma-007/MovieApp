using MovieApp.Dto;
using MovieApp.Models;

namespace MovieApp.Interfaces
{
    public interface IUser
    {
        AuthenticatedUser AuthenticateUser(UserLogin loginCredentials);

        Task<bool> RegisterUser(UserMaster userData);

        Task<bool> IsUserExists(int userId);

        bool CheckUserNameAvailability(string userName);
    }
}
