using Hedwig.Repositories;
using AutoMapper;

namespace Hedwig.Models
{
	public class FirstReportingPeriodResolver : IValueResolver<FundingDTO, Funding, ReportingPeriod>
	{
		private readonly IReportingPeriodRepository _reportingPeriods;

		public FirstReportingPeriodResolver(
			IReportingPeriodRepository reportingPeriods
		)
		{
			_reportingPeriods = reportingPeriods;
		}
		public ReportingPeriod Resolve(FundingDTO source, Funding destination, ReportingPeriod destMember, ResolutionContext context)
		{
			if (source.FirstReportingPeriodId.HasValue)
			{
				return source.FirstReportingPeriod ?? _reportingPeriods.GetById(source.FirstReportingPeriodId.Value);
			}

			return null;
		}
	}
}
