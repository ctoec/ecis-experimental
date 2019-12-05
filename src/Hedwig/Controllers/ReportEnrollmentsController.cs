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
  [Route("api/organizations/{orgId:int}/reports/{reportId:int}/[controller]")]
  [ApiController]
  public class ReportEnrollmentsController : ControllerBase
  {
    private readonly IEnrollmentRepository _enrollments;

    public ReportEnrollmentsController(IEnrollmentRepository enrollments)
    {
      _enrollments = enrollments;
    }

    // GET api/organizations/5/reports/1/enrollments
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult<List<Enrollment>>> Get(
      int orgId,
      int reportId,
      [FromQuery(Name = "include[]")] string[] include
    )
    {
      return await _enrollments.GetEnrollmentsForOrganizationReportAsync(orgId, reportId, include);
    }
  }
}
