using System.Collections.Generic;
using System.Linq;

namespace Hedwig.Models.Extensions
{
	public static class ReportExtensions
	{
		public static int GetWeeksUsedForFundingSpace(this IEnumerable<CdcReport> reports, FundingSpace fundingSpace)
		{
			return reports
				.Where(report => report.SubmittedAt.HasValue)
				.Where(report => report.TimeSplitUtilizations != null)
				.SelectMany(report => report.TimeSplitUtilizations)
				.Where(util => util.FundingSpaceId == fundingSpace.Id)
				.Sum(util => util.WeeksUsedForFundingTime(util.FundingSpace.TimeSplit.LesserTime()));
		}
	}
}
