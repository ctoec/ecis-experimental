using Xunit;
using System.Collections.Generic;
using Hedwig.Validations.Rules;
using Hedwig.Validations;
using Hedwig.Models;
using Moq;
using System;
using Hedwig.Repositories;

namespace HedwigTests.Validations.Rules
{
  public class IfEnrollmentEntry_FirstReportingPeriodRequiredTests
  {
    [Theory]
    [InlineData(true, true, false)]
    [InlineData(true, false, true)]
    [InlineData(false, true, false)]
    [InlineData(false, false, false)]
    public void Execute_ReturnsError_IfEnrollmentHasEntryAndSource_AndFundingDoesNotHaveFirstReportingPeriod(
      bool hasEntry,
      bool hasFirstReportingPeriod,
      bool doesError
    )
    {
      // if
      var enrollment = new Enrollment();
      if(hasEntry) enrollment.Entry = DateTime.Now;
      var funding = new Funding();
      funding.Source = FundingSource.CDC;
      if(hasFirstReportingPeriod) {
        funding.FirstReportingPeriodId = It.IsAny<int>();
      }
      funding.Enrollment = enrollment;

      // when
      var rule = new IfEnrollmentEntry_FirstReportingPeriodIdRequired();
      var result = rule.Execute(funding);

      // then
      Assert.Equal(doesError, result != null);
    }
  }
}