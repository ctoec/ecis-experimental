using Xunit;
using Hedwig.Models;
using System;
using Moq;
using Hedwig.Repositories;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
	public class EndOfFirstReportingPeriodIsLaterThanEnrollmentStartDateTests
	{
		[Theory]
		[InlineData("01/01/2010", "01/01/2009", true)]
		[InlineData("01/01/2010", "01/01/2011", false)]
		[InlineData("01/01/2010", "01/01/2010", false)]
		public void Execute_ReturnsError_IfStartDateIsLaterThanReportingPeriodEnd(
			string startDate,
			string reportingPeriodEndDate,
			bool doesError
		)
		{
			// if
			var enrollment = new Enrollment {
				Entry = DateTime.Parse(startDate)
			};

			var reportingPeriod = new ReportingPeriod {
				PeriodEnd = DateTime.Parse(reportingPeriodEndDate)
			};

			var funding = new Funding {
				Enrollment = enrollment,
				FirstReportingPeriod = reportingPeriod
			};

			var _enrollments = new Mock<IEnrollmentRepository>();
			_enrollments.Setup(e => e.GetEnrollmentById(enrollment.Id))
				.Returns(enrollment);

			// when
			var rule = new EndOfFirstReportingPeriodIsLaterThanEnrollmentStartDate(
				_enrollments.Object
			);
			var result = rule.Execute(funding);

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}