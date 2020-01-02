using Xunit;
using Hedwig.Models;
using System;
using Hedwig.Validations.Rules;
using Moq;
using Hedwig.Repositories;

namespace HedwigTests.Validations.Rules
{
  public class StartDateIsBeforeEndOfFirstReportingPeriodTests
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
      var reportingPeriod = new ReportingPeriod {
        PeriodEnd = DateTime.Parse(reportingPeriodEndDate)
      };

      var funding = new Funding {
        FirstReportingPeriod = reportingPeriod
      };

      var enrollment = new Enrollment {
        Entry = DateTime.Parse(startDate),
        Fundings = new Funding[] { funding }
      };

      var _fundings = new Mock<IFundingRepository>();

      // when
      var rule = new StartDateIsBeforeEndOfFirstReportingPeriod(_fundings.Object);
      var result = rule.Execute(enrollment);

      // then
      Assert.Equal(doesError, result != null);
    }
  }
}