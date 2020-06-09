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
using Hedwig.Filters.Attributes;
using Hedwig.Validations;
using AutoMapper;

namespace Hedwig.Controllers
{
	[ApiController]
	[Authorize(Policy = OrganizationAccessPolicyProvider.NAME)]
	[Route("api/organizations/{orgId:int}/[controller]")]
	public class ReportsController : ControllerBase
	{
		private readonly IReportRepository _reports;
		private readonly IMapper _mapper;

		public ReportsController(
			IReportRepository reports,
			IMapper mapper
		)
		{
			_reports = reports;
			_mapper = mapper;
		}

		// GET api/organizations/5/reports
		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ValidateEntityFilterAttribute(Order = 1)]
		[DTOProjectionFilter(typeof(List<OrganizationReportSummaryDTO>), Order = 2)]
		public ActionResult<List<CdcReport>> Get(
			int orgId
		)
		{
			var reports = _reports.GetReportsForOrganization(orgId);
			return Ok(reports);
		}

		// GET api/organizations/5/reports/1
		[HttpGet("{id:int}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ValidateEntityFilterAttribute(Order = 1)]
		[DTOProjectionFilter(typeof(CdcReportDTO), Order = 2)]
		public async Task<ActionResult<CdcReport>> Get(
			int id,
			int orgId
		)
		{
			var report = _reports.GetCdcReportForOrganization(id, orgId);
			if (report == null) return NotFound();

			return Ok(report);
		}

		[HttpPut("{id:int}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ValidateEntityFilter(true /* onExecuting */, Order = 1)]
		[DTOProjectionFilter(typeof(CdcReportDTO), Order = 2)]
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
				var reportDTO = _mapper.Map<CdcReport, CdcReportDTO>(report);
				_reports.UpdateReport(report, reportDTO);
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
