using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Security;
using Hedwig.Validations;

namespace Hedwig.Controllers
{
	[ApiController]
	[Authorize(Policy = OrganizationAccessPolicyProvider.NAME)]
	[Route("api/organizations/{orgId:int}/[controller]")]
	public class ReportsController : ControllerBase
	{
		private readonly INonBlockingValidator _validator;
		private readonly IReportRepository _reports;

		public ReportsController(
			INonBlockingValidator validator,
			IReportRepository reports
		)
		{
			_validator = validator;
			_reports = reports;
		}

		// GET api/organizations/5/reports
		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<ActionResult<List<CdcReport>>> Get(
			int orgId
		)
		{
			var reports = await _reports.GetReportsForOrganizationAsync(orgId);
			_validator.Validate(reports);
			return Ok(reports);
		}

		// GET api/organizations/5/reports/1
		[HttpGet("{id:int}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<CdcReport>> Get(
			int id,
			int orgId,
			[FromQuery(Name = "include[]")] string[] include
		)
		{
			var report = await _reports.GetReportForOrganizationAsync(id, orgId, include);
			if (report == null) return NotFound();

			_validator.Validate(report);
			return Ok(report);
		}

		[HttpPut("{id:int}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<CdcReport>> Put(
			int id,
			int orgId,
			CdcReport report
		)
		{
			if (report.Id != id) return BadRequest();
			if (report.OrganizationId != orgId) return BadRequest();

			_validator.Validate(report);
			if (report.ValidationErrors.Count > 0)
			{
				return BadRequest("Report cannot be submitted with validation errors");
			}

			try
			{
				// TODO what are the update rules for this field?
				// and should we put this somewhere besides the controller?
				if (report.SubmittedAt == null) report.SubmittedAt = DateTime.UtcNow;
				_reports.UpdateReport(report);
				await _reports.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				return NotFound();
			}

			return Ok(report);
		}
	}
}
