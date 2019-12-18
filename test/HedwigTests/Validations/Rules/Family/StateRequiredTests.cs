using Xunit;
using Hedwig.Models;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class StateRequiredTests
  {
    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public void Execute_ReturnsError_IfStateDoesNotExist(
      bool stateExists,
      bool doesError
    )
    {
      // if 
      var family = new Family();
      if(stateExists)
      {
        family.State = "CT";
      }

      // when
      var rule = new StateRequired();
      var result = rule.Execute(family);

      // then
      Assert.Equal(doesError, result != null);
    }
  }
}