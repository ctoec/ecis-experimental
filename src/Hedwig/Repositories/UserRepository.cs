using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class UserRepository : HedwigRepository, IUserRepository
	{

		public UserRepository(HedwigContext context) : base(context) {}

		public async Task<User> GetUserByIdAsync(int id) => await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
	}

	public interface IUserRepository
	{
		Task<User> GetUserByIdAsync(int id);
	}
}
