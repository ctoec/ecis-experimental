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
      string entry = "2000-01-01",
			string exit = null
		)
		{
			enrollment = enrollment ?? EnrollmentHelper.CreateEnrollment(context);

			var funding = new Funding
			{
				EnrollmentId = enrollment.Id,
				Source = source,
				Time = time,
        Entry = DateTime.Parse(entry)
			};

			if (exit != null) funding.Exit = DateTime.Parse(exit);

			context.Fundings.Add(funding);
			context.SaveChanges();
			return funding;
		}
	}
}
