using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Validations;
using Hedwig.Validations.Rules;
using Xunit;
using Moq;
using System.Collections.Generic;
using System;

namespace HedwigTests.Validations.Rules
{
	public class IfEnrollmentFunded_NotDisclosedFalseTests
	{
		[Theory]
		[InlineData(true, true, true)]
		[InlineData(true, false, false)]
		[InlineData(false, true, false)]
		[InlineData(false, false, false)]
		public void Execute_ReturnsError_IfEnrollmentFunded_AndNotDisclosedIsTrue(
			bool enrollmentIsFunded,
			bool notDisclosed,
			bool doesError
		)
		{
			// if
			var enrollment = new Enrollment
			{
				Fundings = new List<Funding>()
			};
			if (enrollmentIsFunded)
			{
				enrollment.Fundings.Add(new Funding { Source = FundingSource.CDC });
			}

			var determination = new FamilyDetermination
			{
				NotDisclosed = notDisclosed
			};

			// when
			var fundings = new Mock<IFundingRepository>();
			var rule = new IfEnrollmentFunded_NotDeterminedFalse(fundings.Object);

			var context = new NonBlockingValidationContext();
			context.AddParentEntity(enrollment);

			var result = rule.Execute(determination, context);

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}
