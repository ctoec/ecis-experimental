using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class FundingHelper
	{
		public static Funding CreateFunding(
			HedwigContext context,
			FundingSource source = FundingSource.CDC,
			FundingTime time = FundingTime.Full,
			Enrollment enrollment = null
		)
		{
			enrollment = enrollment ?? EnrollmentHelper.CreateEnrollment(context);

			var funding = new Funding
			{
				EnrollmentId = enrollment.Id,
				Source = source,
				Time = time
			};

			context.Fundings.Add(funding);
			context.SaveChanges();
			return funding;
		}
	}
}
