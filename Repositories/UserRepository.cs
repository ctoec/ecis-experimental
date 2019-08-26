using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using ecis2.Models;
using ecis2.Data;

namespace ecis2.Repositories
{
	public class UserRepository : IUserRepository
	{
		private readonly EcisContext _context;

		public UserRepository(EcisContext context) => _context = context;

		public Task<User> GetUserByIdAsync(int id) => _context.Users.SingleOrDefaultAsync(u => u.Id == id);
	}

	public interface IUserRepository
	{
		Task<User> GetUserByIdAsync(int id);
	}
}
