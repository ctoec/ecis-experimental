using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class UserRepository : IUserRepository
	{
		private readonly HedwigContext _context;

		public UserRepository(HedwigContext context) => _context = context;

		public Task<User> GetUserByIdAsync(int id) => _context.Users.SingleOrDefaultAsync(u => u.Id == id);
	}

	public interface IUserRepository
	{
		Task<User> GetUserByIdAsync(int id);
	}
}
