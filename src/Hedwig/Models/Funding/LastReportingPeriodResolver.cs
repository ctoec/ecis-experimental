using Hedwig.Repositories;
using AutoMapper;

namespace Hedwig.Models
{
	public class LastReportingPeriodResolver: IValueResolver<FundingDTO, Funding, ReportingPeriod>
	{
		private readonly IReportingPeriodRepository _reportingPeriods;

		public LastReportingPeriodResolver(
			IReportingPeriodRepository reportingPeriods
		)
		{
			_reportingPeriods = reportingPeriods;
		}
		public ReportingPeriod Resolve(FundingDTO fundingDTO, Funding funding, ReportingPeriod reportingPeriod, ResolutionContext context)
		{
			if(fundingDTO.LastReportingPeriodId.HasValue) {
				return fundingDTO.FirstReportingPeriod ?? _reportingPeriods.GetById(fundingDTO.LastReportingPeriodId.Value);
			}

			return null;
		}
	}
}
