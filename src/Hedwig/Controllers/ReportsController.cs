using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Controllers
{
  [Route("api/organizations/{orgId:int}/[controller]")]
  [ApiController]
  public class ReportsController : ControllerBase
  {
    private readonly IReportRepository _reports;

    public ReportsController(IReportRepository reports)
    {
      _reports = reports;
    }

    // GET api/organizations/5/reports
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult<List<Report>>> Get(
      int orgId
    )
    {
      return await _reports.GetReportsForOrganization(orgId);
    }

    // GET api/organizations/5/reports/1
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Report>> Get(
      int id,
      int orgId,
      [FromQuery(Name = "include[]")] string[] include
    )
    {
      var report = await _reports.GetReportForOrganizationAsync(id, orgId, include);
      if (report == null) return NotFound();
      return report;
    }
  }
}
