using System.Threading.Tasks;
using Hedwig.Models;
using Hedwig.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Hedwig.Filters.Attributes;

namespace Hedwig.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class OrganizationsController : ControllerBase
	{
		private readonly IOrganizationRepository _organizations;

		public OrganizationsController(IOrganizationRepository organizations)
		{
			_organizations = organizations;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[DTOProjectionFilter(typeof(OrganizationDTO))]
		public async Task<ActionResult<Organization>> Get(int id)
		{
			var organization = await _organizations.GetOrganizationByIdAsync(id);

			if (organization == null) return NotFound();

			return Ok(organization);
		}
	}
}
