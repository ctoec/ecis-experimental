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
using Hedwig.Filters;

namespace Hedwig.Controllers
{
	[ApiController]
	[Authorize(Policy = OrganizationAccessPolicyProvider.NAME)]
	[Route("api/organizations/{orgId:int}/[controller]")]
	public class ReportsController : ControllerBase
	{
		private readonly IReportRepository _reports;

		public ReportsController(
			IReportRepository reports
		)
		{
			_reports = reports;
		}

		// GET api/organizations/5/reports
		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[TypeFilter(typeof(ValidateEntityFilterAttribute), Order = 1)]
		[TransformEntityFilter(Order = 2)]
		public async Task<ActionResult<List<CdcReport>>> Get(
			int orgId
		)
		{
			var reports = await _reports.GetReportsForOrganizationAsync(orgId);
			return Ok(reports);
		}

		// GET api/organizations/5/reports/1
		[HttpGet("{id:int}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[TypeFilter(typeof(ValidateEntityFilterAttribute), Order = 1)]
		[TransformEntityFilter(Order = 2)]
		public async Task<ActionResult<CdcReport>> Get(
			int id,
			int orgId,
			[FromQuery(Name = "include[]")] string[] include
		)
		{
			var report = await _reports.GetReportForOrganizationAsync(id, orgId, include);
			if (report == null) return NotFound();

			return Ok(report);
		}

		[HttpPut("{id:int}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[TypeFilter(typeof(ValidateEntityFilterAttribute), Arguments = new object[] { true }, Order = 1)]
		[TransformEntityFilter(Order = 2)]
		public async Task<ActionResult<CdcReport>> Put(
			int id,
			int orgId,
			CdcReport report
		)
		{
			if (report.Id != id) return BadRequest();
			if (report.OrganizationId != orgId) return BadRequest();

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
