using Hedwig.Models;
using Hedwig.Validations.Rules;
using Hedwig.Validations;
using Moq;
using System;
using System.Collections.Generic;
using Hedwig.Repositories;
using Xunit;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;

namespace HedwigTests.Validations.Rules
{
	public class FundingsAreValidTests
	{
		[Theory]
		[InlineData(true, false)]
		[InlineData(false, true)]
		public void Execute_ReturnsError_IfFundingIsNotValid(
			bool fundingIsValid,
			bool doesError
		)
		{
			// if
			var funding = new Funding();
			var enrollment = new Enrollment
			{
				Id = 1,
				Fundings = new List<Funding> { funding }
			};

			var fundingRule = new Mock<IValidationRule<Funding>>();
			var fundingResult = fundingIsValid ? null : new ValidationError("message", field: "field");
			fundingRule.Setup(cr => cr.Execute(funding, It.IsAny<NonBlockingValidationContext>()))
				.Returns(fundingResult);

			var _serviceProvider = new Mock<IServiceProvider>();
			_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Funding>>)))
				.Returns(new List<IValidationRule<Funding>> { fundingRule.Object });

			var _validator = new NonBlockingValidator(_serviceProvider.Object);
			var _fundings = new Mock<IFundingRepository>();

			// when
			var rule = new FundingsAreValid(_validator, _fundings.Object);
			var result = rule.Execute(enrollment, new NonBlockingValidationContext());

			// then
			Assert.Equal(doesError, result != null);
		}

		[Theory]
		[InlineData(true)]
		[InlineData(false)]
		public void Execute_DoesNotAddFundingsToEnrollment(bool enrollmentHasFundingsReference)
		{
			Enrollment enrollment;
			using (var context = new TestHedwigContextProvider().Context)
			{
				enrollment = EnrollmentHelper.CreateEnrollment(context);
				FundingHelper.CreateFunding(context, enrollment: enrollment);
			}

			if (!enrollmentHasFundingsReference) enrollment.Fundings = null;

			using (var context = new TestHedwigContextProvider().Context)
			{
				context.Attach(enrollment);
				var _serviceProvider = new Mock<IServiceProvider>();
				_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Funding>>)))
					.Returns(new List<IValidationRule<Funding>>());
				var _validator = new NonBlockingValidator(_serviceProvider.Object);
				var _fundings = new FundingRepository(context);

				// when
				var rule = new FundingsAreValid(_validator, _fundings);
				rule.Execute(enrollment, new NonBlockingValidationContext());

				// then
				Assert.Equal(enrollmentHasFundingsReference, enrollment.Fundings != null);
			}
		}
	}
}
