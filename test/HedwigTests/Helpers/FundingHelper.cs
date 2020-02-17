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
			FundingTime time = FundingTime.Full,
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
				Time = time,
			};

			if (firstReportingPeriod != null) funding.FirstReportingPeriodId = firstReportingPeriod.Id;
			if (lastReportingPeriod != null) funding.LastReportingPeriodId = lastReportingPeriod.Id;

			context.Fundings.Add(funding);
			context.SaveChanges();
			return funding;
		}
	}
}
