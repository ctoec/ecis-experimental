using Hedwig.Repositories;
using AutoMapper;

namespace Hedwig.Models
{
	public class FirstReportingPeriodResolver: IValueResolver<FundingDTO, Funding, ReportingPeriod>
	{
		private readonly IReportingPeriodRepository _reportingPeriods;

		public FirstReportingPeriodResolver(
			IReportingPeriodRepository reportingPeriods
		) {
			_reportingPeriods = reportingPeriods;
		}
		public ReportingPeriod Resolve(FundingDTO fundingDTO, Funding funding, ReportingPeriod reportingPeriod, ResolutionContext context)
		{
			if(fundingDTO.FirstReportingPeriodId.HasValue) {
				return fundingDTO.FirstReportingPeriod ?? _reportingPeriods.GetById(fundingDTO.FirstReportingPeriodId.Value);
			}

			return null;
		}
	}
}
