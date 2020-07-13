using System.Threading.Tasks;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hedwig.Controllers
{
	[ApiController]
	[Authorize(Policy = OrganizationAccessPolicyProvider.NAME)]
	[Route("api/organizations/{orgId:int}/[controller]")]
	public class SitesController : ControllerBase
	{
		private readonly ISiteRepository _sites;

		public SitesController(
			ISiteRepository sites
		)
		{
			_sites = sites;
		}

		// GET api/organizations/5/sites/1
		[HttpGet("{id:int}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<Site>> Get(
			int id,
			int orgId
		)
		{
			var site = await _sites.GetSiteForOrganizationAsync(id, orgId);
			if (site == null) return NotFound();
			return Ok(site);
		}
	}
}
