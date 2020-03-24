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
	public class FundingTimelinesAreValidTests
	{
		[Theory]
		[InlineData(2010, 2011, 2012, 2013, false)]
		[InlineData(2010, 2011, 2012, null, false)]
		[InlineData(2010, 2011, 2011, 2013, true)]
		[InlineData(2010, 2011, 2011, null, true)]
		[InlineData(2010, 2011, 2010, 2013, true)]
		[InlineData(2010, 2011, 2009, 2013, true)]
		[InlineData(2010, 2011, 2010, null, true)]
		[InlineData(2010, 2011, 2009, null, true)]
		[InlineData(2010, null, 2012, 2013, true)]
		public void Execute_ReturnsError_IfAnyFundingIsNotValid(
			int? f1FirstReportingPeriodStartYear,
			int? f1LastReportingPeriodStartYear,
			int? f2FirstReportingPeriodStartYear,
			int? f2LastReportingPeriodStartYear,
			bool doesError
		)
		{
			// if
			var child = new Child();
			var enrollment = new Enrollment
			{
				Child = child,
				ChildId = child.Id
			};

			var f1FirstReportingPeriod = f1FirstReportingPeriodStartYear != null ?
			new ReportingPeriod
			{
				PeriodStart = new DateTime((int)f1FirstReportingPeriodStartYear, 1, 1)
			} :
			null;
			var f1LastReportingPeriod = f1LastReportingPeriodStartYear != null ?
			new ReportingPeriod
			{
				PeriodStart = new DateTime((int)f1LastReportingPeriodStartYear, 1, 1)
			} :
			null;
			var funding1 = new Funding
			{
				Enrollment = enrollment,
				EnrollmentId = enrollment.Id,
				FirstReportingPeriod = f1FirstReportingPeriod,
				LastReportingPeriod = f1LastReportingPeriod
			};

			var f2FirstReportingPeriod = f2FirstReportingPeriodStartYear != null ?
			new ReportingPeriod
			{
				PeriodStart = new DateTime((int)f2FirstReportingPeriodStartYear, 1, 1)
			} :
			null;
			var f2LastReportingPeriod = f2LastReportingPeriodStartYear != null ?
			new ReportingPeriod
			{
				PeriodStart = new DateTime((int)f2LastReportingPeriodStartYear, 1, 1)
			} :
			null;
			var funding2 = new Funding
			{
				Enrollment = enrollment,
				EnrollmentId = enrollment.Id,
				FirstReportingPeriod = f2FirstReportingPeriod,
				LastReportingPeriod = f2LastReportingPeriod
			};

			var fundingRule = new Mock<IValidationRule<Funding>>();
			var _serviceProvider = new Mock<IServiceProvider>();
			_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Funding>>)))
			.Returns(new List<IValidationRule<Funding>> { fundingRule.Object });

			var _fundings = new Mock<IFundingRepository>();
			_fundings.Setup(f => f.GetFundingsByChildId(It.IsAny<Guid>())).Returns(new List<Funding> { funding1, funding2 });
			var _enrollments = new Mock<IEnrollmentRepository>();

			// when
			var rule = new FundingTimelinesAreValid(_fundings.Object, _enrollments.Object);
			var result = rule.Execute(funding1, new NonBlockingValidationContext());

			// Then
			Assert.Equal(doesError, result != null);
		}
	}
}
