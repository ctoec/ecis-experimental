using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Hedwig.Repositories;
using Hedwig.Security;

namespace Hedwig.Controllers
{
	[ApiController]
	[Authorize(Policy = OrganizationAccessPolicyProvider.NAME)]
	[Route("api/organizations/{orgId:int}/[controller]")]
	public class ChildrenController : ControllerBase
	{
		private readonly IChildRepository _children;
		public ChildrenController(
			IChildRepository children
		)
		{
			_children = children;
		}
	}
}
