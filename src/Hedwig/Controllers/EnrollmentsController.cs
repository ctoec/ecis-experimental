using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Validations;
using Hedwig.Security;
using System;
using System.Linq;

namespace Hedwig.Controllers
{
	[ApiController]
	[Authorize(Policy = SiteAccessPolicyProvider.NAME)]
	[Route("api/organizations/{orgId:int}/sites/{siteId:int}/[controller]")]
	public class EnrollmentsController : ControllerBase
	{
		private readonly INonBlockingValidator _validator;
		private readonly IEnrollmentRepository _enrollments;
		private readonly ISiteRepository _sites;
		public EnrollmentsController(
			INonBlockingValidator validator,
			IEnrollmentRepository enrollments,
			ISiteRepository sites
		)
		{
			_validator = validator;
			_enrollments = enrollments;
			_sites = sites;
		}

		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<ActionResult<List<Enrollment>>> Get(
			int orgId,
			int siteId,
			[FromQuery(Name="include[]")] string[] include,
			[FromQuery(Name="startDate")] DateTime? from = null,
			[FromQuery(Name="endDate")] DateTime? to = null
		)
		{

			var enrollments = await _enrollments.GetEnrollmentsForSiteAsync(siteId, from, to, include);
			_validator.Validate(enrollments);
			return enrollments;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<Enrollment>> Get(
			int id,
			int orgId,
			int siteId,
			[FromQuery(Name="include[]")] string [] include
		)
		{

			var enrollment = await _enrollments.GetEnrollmentForSiteAsync(id, siteId, include);
			if(enrollment == null) return NotFound();

			_validator.Validate(enrollment);

			return enrollment;
		}

		[HttpGet("/api/organizations/{orgId:int}/[controller]")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<ActionResult<List<Enrollment>>> GetForOrganizationBySite(
			int orgId,
			[FromQuery(Name="siteIds[]")] int[] siteIds,
			[FromQuery(Name="include[]")] string[] include,
			[FromQuery(Name="startDate")] DateTime? from = null,
			[FromQuery(Name="endDate")] DateTime? to = null
		)
		{
			var orgSites = await _sites.GetSitesForOrganizationAsync(orgId);
			var allSitesInOrg = siteIds.All(siteId => orgSites.Select(site => site.Id).Contains(siteId));
			if (!allSitesInOrg)
			{
				return BadRequest("Some sites not in the associated organization.");
			}
			var enrollments = new List<Enrollment>();
			foreach (var siteId in siteIds)
			{
				var siteEnrollments = await _enrollments.GetEnrollmentsForSiteAsync(siteId, from, to, include);
				enrollments.AddRange(siteEnrollments);
			}
			_validator.Validate(enrollments);
			return enrollments;
		}

		[HttpPost]
		[ProducesResponseType(StatusCodes.Status201Created)]
		[ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
		public async Task<ActionResult<Enrollment>> Post(
			int orgId,
			int siteId,
			Enrollment enrollment
		)
		{
			// Creating enrollment with Id not allowed
			if (enrollment.Id != 0) return BadRequest();

			_enrollments.AddEnrollment(enrollment);
			await _enrollments.SaveChangesAsync();

			_validator.Validate(enrollment);
			return CreatedAtAction(
				nameof(Get),
				new { id = enrollment.Id, orgId = orgId, siteId = siteId },
				enrollment
			);
		}

		[HttpPut("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<Enrollment>> Put(
			int id,
			int orgId,
			int siteId,
			Enrollment enrollment
		)
		{
			if (enrollment.Id != id) return BadRequest();

			try {
				_enrollments.UpdateEnrollment(enrollment);
				await _enrollments.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				return NotFound();
			}

			_validator.Validate(enrollment);
			return Ok(enrollment);
		}

		[HttpDelete("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult> Delete(
			int id,
			int orgId,
			int siteId,
			Enrollment enrollment
		)
		{
			if (enrollment.Id != id) return BadRequest();

			try {
				_enrollments.DeleteEnrollment(enrollment);
				await _enrollments.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				return NotFound();
			}

			return Ok();
		}
	}
}
