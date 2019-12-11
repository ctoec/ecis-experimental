using Xunit;
using Hedwig.Models;
using System;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class DeterminedWithinSixMonthsTests
  {
    [Theory]
    [InlineData(-5, false)]
    [InlineData(-7, true)]
    public void WithinSixMonths_Execute(
      int monthDifference,
      bool doesError
    )
    {
      // if
      var determination = new FamilyDetermination {
        Determined = DateTime.Now.AddMonths(monthDifference)
      };

      // when
      var rule = new DeterminedWithinSixMonths();
      var result = rule.Execute(determination);

      // then
      Assert.Equal(doesError, result != null);
    }
  }
}