using Hedwig.Repositories;
using Hedwig.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
