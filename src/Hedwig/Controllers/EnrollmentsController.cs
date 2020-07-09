using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Hedwig.Filters.Attributes;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hedwig.Controllers
{
	[ApiController]
	[Authorize(Policy = SiteAccessPolicyProvider.NAME)]
	[Route("api/organizations/{orgId:int}/sites/{siteId:int}/[controller]")]
	public class EnrollmentsController : ControllerBase
	{
		private readonly IEnrollmentRepository _enrollments;
		private readonly ISiteRepository _sites;
		private readonly IMapper _mapper;

		public EnrollmentsController(
			IEnrollmentRepository enrollments,
			ISiteRepository sites,
			IMapper mapper
		)
		{
			_enrollments = enrollments;
			_sites = sites;
			_mapper = mapper;
		}

		// GET api/organizations/1/enrollments
		[HttpGet("/api/organizations/{orgId:int}/[controller]")]
		[Authorize(Policy = OrganizationAccessPolicyProvider.NAME)]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ValidateEntityFilterAttribute(Order = 1)]
		[DTOProjectionFilter(typeof(List<EnrollmentDTO>), Order = 2)]
		public async Task<ActionResult<List<Enrollment>>> Get(
			int orgId,
			[FromQuery(Name = "siteIds[]")] int[] siteIds,
			[FromQuery(Name = "startDate")] DateTime? from = null,
			[FromQuery(Name = "endDate")] DateTime? to = null,
			[FromQuery(Name = "asOf")] DateTime? asOf = null,
			[FromQuery(Name = "skip")] int skip = 0,
			[FromQuery(Name = "take")] int? take = null
		)
		{
			var enrollments = new List<Enrollment>();
			if (siteIds.Length > 0)
			// Only get enrollments in the given sites (that are in the given organization)
			{
				var orgSites = _sites.GetSitesByOrganizationId(orgId);
				var allSitesInOrg = siteIds.All(siteId => orgSites.Select(site => site.Id).Contains(siteId));
				if (!allSitesInOrg)
				{
					return BadRequest("Some sites not in the associated organization.");
				}

				foreach (var siteId in siteIds)
				{
					var siteEnrollments = await _enrollments.GetEnrollmentsForSiteAsync(siteId, from, to, skip, take);
					enrollments.AddRange(siteEnrollments);
				}
			}
			else
			// If no sites are specified, get all enrollments for the organization
			{
				enrollments = await _enrollments.GetEnrollmentsForOrganizationAsync(orgId, from, to, asOf, skip, take);
			}

			return enrollments;
		}

		// GET api/organizations/1/sites/1/enrollments
		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ValidateEntityFilterAttribute(Order = 1)]
		[DTOProjectionFilter(typeof(List<EnrollmentDTO>), Order = 2)]
		public async Task<ActionResult<List<Enrollment>>> Get(
			int orgId,
			int siteId,
			[FromQuery(Name = "startDate")] DateTime? from = null,
			[FromQuery(Name = "endDate")] DateTime? to = null,
			[FromQuery(Name = "skip")] int skip = 0,
			[FromQuery(Name = "take")] int? take = null
		)
		{
			var enrollments = await _enrollments.GetEnrollmentsForSiteAsync(siteId, from, to, skip, take);
			return enrollments;
		}

		// GET api/organizations/1/sites/1/enrollments/1
		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ValidateEntityFilterAttribute(Order = 1)]
		[DTOProjectionFilter(typeof(EnrollmentDTO), Order = 2)]
		public async Task<ActionResult<Enrollment>> Get(
			int id,
			int orgId,
			int siteId
		)
		{

			var enrollment = await _enrollments.GetEnrollmentForSiteAsync(id, siteId);
			if (enrollment == null) return NotFound();

			return enrollment;
		}

		[HttpPost]
		[ProducesResponseType(StatusCodes.Status201Created)]
		[ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
		[ValidateEntityFilterAttribute(Order = 1)]
		[DTOProjectionFilter(typeof(EnrollmentDTO), Order = 2)]
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
		[ValidateEntityFilterAttribute(Order = 1)]
		[DTOProjectionFilter(typeof(EnrollmentDTO), Order = 2)]
		public async Task<ActionResult<Enrollment>> Put(
			int id,
			int orgId,
			int siteId,
			Enrollment enrollment
		)
		{
			if (enrollment.Id != id) return BadRequest();

			try
			{
				var enrollmentDTO = _mapper.Map<Enrollment, EnrollmentDTO>(enrollment);
				_enrollments.UpdateEnrollment(enrollment, enrollmentDTO);
				await _enrollments.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				return NotFound();
			}

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

			try
			{
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
