using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Hedwig.Security;
using Hedwig.Repositories;
using Hedwig.Models;

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


		// GET api/organizations/5/sites
		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<ActionResult<List<Site>>> Get(int orgId)
		{
			var sites = await _sites.GetSitesForOrganizationAsync(orgId);
			return Ok(sites);
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
