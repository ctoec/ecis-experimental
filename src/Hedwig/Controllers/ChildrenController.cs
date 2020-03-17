using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Validations;
using Hedwig.Security;
using Hedwig.Filters;

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

		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[TypeFilter(typeof(ValidateEntityFilterAttribute), Order = 1)]
		[TransformEntityFilter(Order = 2)]
		public async Task<ActionResult<Child>> Get(
			int orgId,
			Guid id,
			[FromQuery(Name = "include[]")] string[] include
		)
		{
			var child = await _children.GetChildForOrganizationAsync(id, orgId, include);
			if (child == null) return NotFound();

			return Ok(child);

		}

		[HttpPost]
		public async Task<ActionResult<Child>> Post(
			int orgId,
			Child child
		)
		{
			if(child.Id != Guid.Empty) return BadRequest();

			_children.AddChild(child);
			await _children.SaveChangesAsync();

			return CreatedAtAction(
				nameof(Get),
				new { id = child.Id, orgId = orgId },
				child
			);
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<Child>> Put(
			Guid id,
			int orgId,
			Child child
		)
		{
			if(child.Id != id) return BadRequest();

			try 
			{
				_children.UpdateChild(child);
				await _children.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				return NotFound();
			}

			return Ok();
		}
	}
}
