using Hedwig.Repositories;
using AutoMapper;

namespace Hedwig.Models
{
	public class LastReportingPeriodResolver : IValueResolver<FundingDTO, Funding, ReportingPeriod>
	{
		private readonly IReportingPeriodRepository _reportingPeriods;

		public LastReportingPeriodResolver(
			IReportingPeriodRepository reportingPeriods
		)
		{
			_reportingPeriods = reportingPeriods;
		}
		public ReportingPeriod Resolve(FundingDTO source, Funding destination, ReportingPeriod destMember, ResolutionContext context)
		{
			if (source.LastReportingPeriodId.HasValue)
			{
				return source.FirstReportingPeriod ?? _reportingPeriods.GetById(source.LastReportingPeriodId.Value);
			}

			return null;
		}
	}
}
