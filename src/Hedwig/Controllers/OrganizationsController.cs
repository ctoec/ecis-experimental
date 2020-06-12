using AutoMapper;
using Hedwig.Filters.Attributes;
using Hedwig.Models;
using Hedwig.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hedwig.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class OrganizationsController : ControllerBase
	{
		private readonly IOrganizationRepository _organizations;
		private readonly IMapper _mapper;

		public OrganizationsController(IOrganizationRepository organizations,
				IMapper mapper)
		{
			_organizations = organizations;
			_mapper = mapper;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[DTOProjectionFilter(typeof(EnrollmentSummaryOrganizationDTO), Order = 2)]
		public ActionResult<EnrollmentSummaryOrganizationDTO> Get(int id)
		{
			var organization = _organizations.GetOrganizationById(id);

			if (organization == null) return NotFound();

			return Ok(_mapper.Map<EnrollmentSummaryOrganizationDTO>(organization));
		}
	}
}
