using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Hedwig.Repositories;
using Hedwig.Models;

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
		public ActionResult<Organization> Get(int id)
		{
			var organization = _organizations.GetOrganizationById(id);

			if (organization == null) return NotFound();

			return Ok(organization);
		}
	}
}
