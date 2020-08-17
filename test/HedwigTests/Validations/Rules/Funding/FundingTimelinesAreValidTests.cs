using System;
using System.Collections.Generic;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Validations;
using Hedwig.Validations.Rules;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;
using AutoMapper;
using Moq;
using Xunit;

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
			int? f1LastReportingPeriodEndYear,
			int? f2FirstReportingPeriodStartYear,
			int? f2LastReportingPeriodEndYear,
			bool doesError
		)
		{
			// if
			var f1FirstReportingPeriod = f1FirstReportingPeriodStartYear != null ?
			new ReportingPeriod
			{
				PeriodStart = new DateTime((int)f1FirstReportingPeriodStartYear, 1, 1)
			} :
			null;
			var f1LastReportingPeriod = f1LastReportingPeriodEndYear != null ?
			new ReportingPeriod
			{
				PeriodEnd = new DateTime((int)f1LastReportingPeriodEndYear, 1, 1)
			} :
			null;
			var funding1 = new Funding
			{
				Id = 1,
				FirstReportingPeriodId = f1FirstReportingPeriod != null ? f1FirstReportingPeriod.Id : null as int?,
				LastReportingPeriodId = f1LastReportingPeriod != null ? f1LastReportingPeriod.Id : null as int?,
				Source = FundingSource.CDC
			};
			funding1.GetType().GetProperty(nameof(funding1.FirstReportingPeriod)).SetValue(funding1, f1FirstReportingPeriod);
			funding1.GetType().GetProperty(nameof(funding1.LastReportingPeriod)).SetValue(funding1, f1LastReportingPeriod);

			var f2FirstReportingPeriod = f2FirstReportingPeriodStartYear != null ?
			new ReportingPeriod
			{
				PeriodStart = new DateTime((int)f2FirstReportingPeriodStartYear, 1, 1)
			} :
			null;
			var f2LastReportingPeriod = f2LastReportingPeriodEndYear != null ?
			new ReportingPeriod
			{
				PeriodEnd = new DateTime((int)f2LastReportingPeriodEndYear, 1, 1)
			} :
			null;
			var funding2 = new Funding
			{
				Id = 2,
				FirstReportingPeriodId = f2FirstReportingPeriod != null ? f2FirstReportingPeriod.Id : null as int?,
				LastReportingPeriodId = f2LastReportingPeriod != null ? f2LastReportingPeriod.Id : null as int?,
				Source = FundingSource.CDC
			};
			funding2.GetType().GetProperty(nameof(funding2.FirstReportingPeriod)).SetValue(funding2, f2FirstReportingPeriod);
			funding2.GetType().GetProperty(nameof(funding2.LastReportingPeriod)).SetValue(funding2, f2LastReportingPeriod);

			var child = new Child();
			var enrollment = new Enrollment
			{
				Child = child,
				ChildId = child.Id,
				Fundings = new List<Funding> { funding1, funding2 },
			};
			funding1.Enrollment = enrollment;
			funding2.Enrollment = enrollment;

			var fundingRule = new Mock<IValidationRule<Funding>>();
			var _serviceProvider = new Mock<IServiceProvider>();
			_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Funding>>)))
			.Returns(new List<IValidationRule<Funding>> { fundingRule.Object });

			var _fundings = new Mock<IFundingRepository>();
			_fundings.Setup(f => f.GetFundingsByChildId(It.IsAny<Guid>())).Returns(new List<Funding> { funding1, funding2 });
			var _enrollments = new Mock<IEnrollmentRepository>();
			var _reportingPeriods = new Mock<IReportingPeriodRepository>();

			// when
			var rule = new FundingTimelinesAreValid(_fundings.Object, _enrollments.Object, _reportingPeriods.Object);
			var result = rule.Execute(funding1, new NonBlockingValidationContext());

			// Then
			Assert.Equal(doesError, result != null);
		}


		[Theory]
		[InlineData(true)]
		[InlineData(false)]
		public void Execute_DoesNotAddEnrollmentToFunding(bool fundingHasEnrollmentReference)
		{
			Funding funding;
			using (var context = new TestHedwigContextProvider().Context)
			{
				funding = FundingHelper.CreateFunding(context);
			}

			if (!fundingHasEnrollmentReference) funding.Enrollment = null;

			using (var context = new TestHedwigContextProvider().Context)
			{
				// Only attach found entity to avoid attaching the entire object graph
				// (which would find & attach the enrollment navigation property)
				context.Attach(context.Find(funding.GetType(), funding.Id));

				var _serviceProvider = new Mock<IServiceProvider>();
				var _validator = new NonBlockingValidator(_serviceProvider.Object);
				var _fundings = new FundingRepository(context);
				var mapper = new MapperConfiguration(opts =>
				{
					opts.AddProfile(new EnrollmentProfile());
					opts.AddProfile(new FundingProfile());
					opts.AddProfile(new ChildProfile());
					opts.AddProfile(new FamilyProfile());
					opts.AddProfile(new SiteProfile());
				}).CreateMapper();
				var _enrollments = new EnrollmentRepository(context, mapper);
				var _reportingPeriods = new ReportingPeriodRepository(context);

				// when
				var rule = new FundingTimelinesAreValid(_fundings, _enrollments, _reportingPeriods);
				rule.Execute(funding, new NonBlockingValidationContext());

				// then
				Assert.Equal(fundingHasEnrollmentReference, funding.Enrollment != null);
			}
		}
	}
}
