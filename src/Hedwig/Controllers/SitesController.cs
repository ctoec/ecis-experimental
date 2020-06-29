using AutoMapper;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hedwig.Controllers
{
	[ApiController]
	[Authorize(Policy = OrganizationAccessPolicyProvider.NAME)]
	[Route("api/organizations/{orgId:int}/[controller]")]
	public class SitesController : ControllerBase
	{
		private readonly ISiteRepository _sites;
		private readonly IMapper _mapper;

		public SitesController(
			ISiteRepository sites,
			IMapper mapper
		)
		{
			_sites = sites;
			_mapper = mapper;
		}


		// GET api/organizations/5/sites
		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<ActionResult<List<Site>>> Get(int orgId)
		{
			var siteDTOs = await _sites.GetEnrollmentSummarySiteDTOsForOrganizationAsync(orgId);
			return Ok(_mapper.Map<List<EnrollmentSummarySiteDTO>, List<Site>>(siteDTOs));
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
			var siteDTO = _mapper.Map<Site, OrganizationSiteDTO>(site);
			return Ok(_mapper.Map<OrganizationSiteDTO, Site>(siteDTO));
		}
	}
}
