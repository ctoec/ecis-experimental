using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hedwig.Repositories;
using Hedwig.Models;

namespace Hedwig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportingPeriodController : ControllerBase
    {
        private readonly IReportingPeriodRepository _periods;

        public ReportingPeriodController(IReportingPeriodRepository periods)
        {
            _periods = periods;
        }

        // GET api/ReportingPeriod/CDC
        [HttpGet("{source}")]
        public async Task<ActionResult<List<ReportingPeriod>>> Get(
            FundingSource source
        )
        {
            return await _periods.GetReportingPeriodsByFundingSourceAsync(source);
        }
    }
}
