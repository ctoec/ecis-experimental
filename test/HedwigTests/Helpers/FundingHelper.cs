using System;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class FundingHelper
	{
		public static Funding CreateFunding(
			HedwigContext context,
			FundingSource source = FundingSource.CDC,
			Enrollment enrollment = null
		)
		{
			enrollment = enrollment ?? EnrollmentHelper.CreateEnrollment(context);

			var funding = new Funding
			{
				EnrollmentId = enrollment.Id,
				Source = source
			};

			context.Fundings.Add(funding);
			context.SaveChanges();
			return funding;
		}
	}
}
