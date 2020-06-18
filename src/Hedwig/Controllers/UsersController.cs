using System;
using System.Threading.Tasks;
using Hedwig.Models;
using Hedwig.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Hedwig.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly IUserRepository _users;

		public UsersController(IUserRepository users)
		{
			_users = users;
		}

		// GET api/users/current
		[HttpGet("current")]
		public ActionResult<User> GetCurrent()
		{
			var subClaim = User.FindFirst("sub")?.Value;
			if (subClaim == null) { return null; }
			var wingedKeysId = Guid.Parse(subClaim);
			return _users.GetUserByWingedKeysId(wingedKeysId);
		}
	}
}
