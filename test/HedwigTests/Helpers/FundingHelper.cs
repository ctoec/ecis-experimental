using System;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
    public class FundingHelper
    {
        public static Funding CreateFunding(HedwigContext context)
        {
            var enrollment = EnrollmentHelper.CreateEnrollment(context);
            var funding = new Funding { 
                EnrollmentId = enrollment.Id,
                Source = FundingSource.CDC
            };
            context.Fundings.Add(funding);
            context.SaveChanges();
            return funding;
        }

        public static Funding CreateFundingWithEnrollmentId(HedwigContext context, int enrollmentId)
        {
            var funding = new Funding{
                EnrollmentId = enrollmentId,
                Source = FundingSource. CDC
            };
            context.Fundings.Add(funding);
            context.SaveChanges();
            return funding;
        }
    }
}