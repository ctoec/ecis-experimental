using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Validations;
using Hedwig.Security;

namespace Hedwig.Controllers
{
	[ApiController]
	[Authorize(Policy = OrganizationAccessPolicyProvider.NAME)]
  [Route("api/organizations/{orgId:int}/[controller]")]
	public class ChildrenController : ControllerBase
	{
		private readonly INonBlockingValidator _validator;
		private readonly IChildRepository _children;
		public ChildrenController(
			INonBlockingValidator validator,
			IChildRepository children
		)
		{
			_validator = validator;
			_children = children;
		}

		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<ActionResult<IDictionary<Guid, ICollection<Enrollment>>>> Get(
			int orgId,
			[FromQuery(Name="include[]")] string[] include,
			[FromQuery(Name="startDate")] DateTime? from = null,
			[FromQuery(Name="endDate")] DateTime? to = null
		)
		{
			var children = await _children.GetChildrenForOrganizationAsync(orgId, from, to, include);
			return Ok(children);
		}
	}
}