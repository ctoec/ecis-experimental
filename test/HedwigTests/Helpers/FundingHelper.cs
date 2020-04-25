using Hedwig.Data;
using Hedwig.Models;
using System.Linq;

namespace HedwigTests.Helpers
{
	public class FundingHelper
	{
		public static Funding CreateFunding(
			HedwigContext context,
			FundingSource source = FundingSource.CDC,
			Enrollment enrollment = null,
			ReportingPeriod firstReportingPeriod = null,
			ReportingPeriod lastReportingPeriod = null,
			FundingSpace fundingSpace = null
		)
		{
			enrollment = enrollment ?? EnrollmentHelper.CreateEnrollment(context);
			fundingSpace = fundingSpace ??
				FundingSpaceHelper.CreateFundingSpace(context, enrollment.Site.OrganizationId);
			var funding = new Funding
			{
				EnrollmentId = enrollment.Id,
				Source = source,
				FirstReportingPeriodId = firstReportingPeriod != null ? firstReportingPeriod.Id : null as int?,
				LastReportingPeriodId = lastReportingPeriod != null ? lastReportingPeriod.Id : null as int?,
				FundingSpaceId = fundingSpace != null ? fundingSpace.Id : null as int?
			};

			context.Fundings.Add(funding);
			context.SaveChanges();
			return funding;
		}
	}
}
