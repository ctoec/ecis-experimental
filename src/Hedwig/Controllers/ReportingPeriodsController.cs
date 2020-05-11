using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hedwig.Repositories;
using Hedwig.Models;

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

		// GET api/ReportingPeriod/CDC
		[HttpGet("{source}")]
		public ActionResult<List<ReportingPeriod>> Get(
			FundingSource source
		)
		{
			return _periods.GetReportingPeriodsByFundingSource(source);
		}
	}
}
