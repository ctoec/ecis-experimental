using Xunit;
using Hedwig.Models;
using System;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class IfDisclosedDeterminationDateRequiredTests
  {
    [Theory]
    [InlineData(true, true, false)]
    [InlineData(false, false, false)]
    [InlineData(true, false, true)]
    public void Execute_ReturnsError_IfDisclosedAndDeterminationDateDoesNotExist(
      bool disclosed,
      bool determinationDateExists,
      bool doesError
    )
    {
      // if 
      var determination = new FamilyDetermination {
        NotDisclosed = !disclosed,
      };

      if(determinationDateExists)
      {
        determination.DeterminationDate = DateTime.Now;
      }

      // when
      var rule = new IfDisclosed_DeterminationDateRequired();
      var result = rule.Execute(determination);

      // then
      Assert.Equal(doesError, result != null);
    }
  }
}