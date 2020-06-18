using System;
using System.Collections.Generic;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Validations;
using Hedwig.Validations.Rules;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;
using Moq;
using Xunit;

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

		[Theory]
		[InlineData(true)]
		[InlineData(false)]
		public void Execute_DoesNotAddEnrollmentsToReport(bool reportHasEnrollmentsReference)
		{
			CdcReport report;
			using (var context = new TestHedwigContextProvider().Context)
			{
				report = ReportHelper.CreateCdcReport(context) as CdcReport;
				var site = SiteHelper.CreateSite(context, organization: report.Organization);
				var enrollments = EnrollmentHelper.CreateEnrollments(context, 1, site: site);
				report.Enrollments = enrollments;
			}

			if (!reportHasEnrollmentsReference) report.Enrollments = null;

			using (var context = new TestHedwigContextProvider().Context)
			{
				context.Attach(report);

				var _serviceProvider = new Mock<IServiceProvider>();
				_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Enrollment>>)))
					.Returns(new List<IValidationRule<Enrollment>>());
				var _validator = new NonBlockingValidator(_serviceProvider.Object);
				var _reports = new ReportRepository(context);

				// when
				var rule = new EnrollmentsAreValid(_validator, _reports);
				rule.Execute(report, new NonBlockingValidationContext());

				// then
				Assert.Equal(reportHasEnrollmentsReference, report.Enrollments != null);
			}
		}
	}
}
