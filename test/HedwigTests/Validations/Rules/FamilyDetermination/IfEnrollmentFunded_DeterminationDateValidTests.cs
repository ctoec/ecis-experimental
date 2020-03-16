using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Validations.Rules;
using Hedwig.Validations;
using Xunit;
using Moq;
using System.Collections.Generic;
using System;

namespace HedwigTests.Validations.Rules
{
	public class IfEnrollmentFunded_DeterminationDateValidTests
	{
		[Theory]
		[InlineData(true, true, false)]
		[InlineData(true, false, true)]
		[InlineData(false, true, false)]
		[InlineData(false, false, false)]
		public void Execute_ReturnsError_IfEnrollmentFunded_AndDeterminationDateNotValid(
			bool enrollmentIsFunded,
			bool dateIsValid,
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
				// a valid date is < 1 year older than TODAY 
				DeterminationDate = dateIsValid ? DateTime.Now.Date.AddMonths(-8) : DateTime.Now.Date.AddMonths(-18)
			};

			// when
			var fundings = new Mock<IFundingRepository>();
			var reportingPeriods = new Mock<IReportingPeriodRepository>();
			var rule = new IfEnrollmentFunded_DeterminationDateValid(fundings.Object, reportingPeriods.Object);

			var context = new NonBlockingValidationContext();
			context.AddParentEntity(enrollment);
			var result = rule.Execute(determination, context);

			// then
			Assert.Equal(doesError, result != null);
		}
		[Theory]
		[InlineData(true, true, false)]
		[InlineData(true, false, true)]
		[InlineData(false, true, false)]
		[InlineData(false, false, false)]
		public void Execute_WithReportParentEntity_ReturnsError_IfEnrollmentFunded_AndDeterminationDateNotValid(
			bool enrollmentIsFunded,
			bool dateIsValid,
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

			var periodEnd = DateTime.Now.Date.AddDays(-10);
			var report = new CdcReport
			{
				ReportingPeriod = new ReportingPeriod
				{
					PeriodEnd = periodEnd
				}
			};

			var determination = new FamilyDetermination
			{
				// a valid date is < 1 year older than report reporting period end
				DeterminationDate = dateIsValid ? periodEnd.AddMonths(-8) : periodEnd.AddMonths(-18)
			};

			// when
			var fundings = new Mock<IFundingRepository>();
			var reportingPeriods = new Mock<IReportingPeriodRepository>();
			var rule = new IfEnrollmentFunded_DeterminationDateValid(fundings.Object, reportingPeriods.Object);

			var context = new NonBlockingValidationContext();
			context.AddParentEntity(enrollment);
			context.AddParentEntity(report);
			var result = rule.Execute(determination, context);

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}
