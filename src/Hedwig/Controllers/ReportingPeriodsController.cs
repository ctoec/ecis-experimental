using System.Collections.Generic;
using System.Threading.Tasks;
using Hedwig.Models;
using Hedwig.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Hedwig.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ReportingPeriodsController : ControllerBase
	{
		private readonly IReportingPeriodRepository _periods;

		public ReportingPeriodsController(IReportingPeriodRepository periods)
		{
			_periods = periods;
		}

		// GET api/ReportingPeriods/CDC
		[HttpGet("{source}")]
		public ActionResult<List<ReportingPeriod>> Get(
			FundingSource source
		)
		{
			return _periods.GetReportingPeriodsByFundingSource(source);
		}
	}
}
