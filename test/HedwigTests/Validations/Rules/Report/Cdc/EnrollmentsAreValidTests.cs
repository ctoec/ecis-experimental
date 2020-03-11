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
	public class EnrollmentsAreValidTests
	{
		[Theory]
		[InlineData(true, false)]
		[InlineData(false, true)]

		public void Execute_ReturnsError_IfAnyEnrollmentIsNotValid(
			bool enrollmentsNotValid,
			bool doesError
		)
		{
			// if
			var e1 = new Enrollment();
			var e2 = new Enrollment();
			var enrollments = new List<Enrollment> { e1, e2 };
			var report = new CdcReport
			{
				Enrollments = enrollments
			};

			var enrollmentRule = new Mock<IValidationRule<Enrollment>>();
			var enrollmentResult = enrollmentsNotValid ? null : new ValidationError("message", field: "field");
			enrollmentRule.Setup(er => er.Execute(e1, It.IsAny<NonBlockingValidationContext>()))
			.Returns(enrollmentResult);

			var _serviceProvider = new Mock<IServiceProvider>();
			_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Enrollment>>)))
			.Returns(new List<IValidationRule<Enrollment>> { enrollmentRule.Object });

			var _validator = new NonBlockingValidator(_serviceProvider.Object);
			var _reports = new Mock<IReportRepository>();

			// when
			var rule = new EnrollmentsAreValid(_validator, _reports.Object);
			var result = rule.Execute(report, new NonBlockingValidationContext());

			// Then
			Assert.Equal(doesError, result != null);
		}
	}
}
