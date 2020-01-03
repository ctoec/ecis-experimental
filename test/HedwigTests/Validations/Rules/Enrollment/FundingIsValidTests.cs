using Hedwig.Models;
using Hedwig.Validations.Rules;
using Hedwig.Validations;
using Moq;
using System;
using System.Collections.Generic;
using Hedwig.Repositories;
using Xunit;

namespace HedwigTests.Validations.Rules
{
	public class FundingIsValidTests
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
			var enrollment = new Enrollment {
				Id = 1,
				Fundings = new Funding[] { funding }
			};

			var fundingRule = new Mock<IValidationRule<Funding>>();
			var fundingResult = fundingIsValid ? null : new ValidationError("message", "field");
			fundingRule.Setup(cr => cr.Execute(funding))
				.Returns(fundingResult);

			var _serviceProvider = new Mock<IServiceProvider>();
			_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Funding>>)))
				.Returns(new List<IValidationRule<Funding>> { fundingRule.Object });

			var _validator = new NonBlockingValidator(_serviceProvider.Object);
			var _funding = new Mock<IFundingRepository>();
			_funding.Setup(f => f.GetFirstFundingByEnrollmentId(enrollment.Id))
				.Returns(funding);

			// when
			var rule = new FundingIsValid(_validator, _funding.Object);
			var result = rule.Execute(enrollment);

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}