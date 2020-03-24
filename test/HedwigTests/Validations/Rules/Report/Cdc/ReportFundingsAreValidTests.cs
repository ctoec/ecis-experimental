using Xunit;
using Hedwig.Models;
using System.Collections.Generic;
using Hedwig.Validations.Rules;
using Hedwig.Validations;
using Moq;
using System;
using Hedwig.Repositories;

namespace HedwigTests.Validations.Rules
{
	public class FundingsAreValidTests
	{
		[Theory]
		[InlineData(true, false)]
		[InlineData(false, true)]

		public void Execute_ReturnsError_IfAnyFundingIsNotValid(
			bool enrollmentsNotValid,
			bool doesError
		)
		{
			// if
			var f1 = new Funding();
			var f2 = new Funding();
			var f3 = new Funding();
			var e1 = new Enrollment
			{
				Fundings = new List<Funding> { f1 },
			};
			var e2 = new Enrollment
			{
				Fundings = new List<Funding> { f2, f3 },
			};
			var enrollments = new List<Enrollment> { e1, e2 };
			var report = new CdcReport
			{
				Enrollments = enrollments
			};

			var fundingRule = new Mock<IValidationRule<Funding>>();
			var fundingResult = enrollmentsNotValid ? null : new ValidationError("message", field: "field");
			fundingRule.Setup(er => er.Execute(It.IsAny<Funding>(), It.IsAny<NonBlockingValidationContext>()))
				.Returns(fundingResult);

			var _serviceProvider = new Mock<IServiceProvider>();
			_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Funding>>)))
			.Returns(new List<IValidationRule<Funding>> { fundingRule.Object });

			var _validator = new NonBlockingValidator(_serviceProvider.Object);
			var _reports = new Mock<IReportRepository>();
			var _fundings = new Mock<IFundingRepository>();

			// when
			var rule = new ReportFundingsAreValid(_validator, _reports.Object, _fundings.Object);
			var result = rule.Execute(report, new NonBlockingValidationContext());

			// Then
			Assert.Equal(doesError, result != null);
		}
	}
}
