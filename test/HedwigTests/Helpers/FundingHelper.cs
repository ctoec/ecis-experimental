using Hedwig.Data;
using Hedwig.Models;
using System;

namespace HedwigTests.Helpers
{
	public class FundingHelper
	{
		public static Funding CreateFunding(
			HedwigContext context,
			FundingSource source = FundingSource.CDC,
			Enrollment enrollment = null,
			ReportingPeriod firstReportingPeriod = null,
			ReportingPeriod lastReportingPeriod = null
		)
		{
			enrollment = enrollment ?? EnrollmentHelper.CreateEnrollment(context);

			var funding = new Funding
			{
				EnrollmentId = enrollment.Id,
				Source = source,
				FirstReportingPeriod = firstReportingPeriod
			};

			if (lastReportingPeriod != null) funding.LastReportingPeriod = lastReportingPeriod;

			context.Fundings.Add(funding);
			context.SaveChanges();
			return funding;
		}
	}
}
