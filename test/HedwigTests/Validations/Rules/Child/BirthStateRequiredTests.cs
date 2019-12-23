using Xunit;
using Hedwig.Models;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class BirthStateRequiredTests
  {
    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public void Execute_ReturnsError_IfBirthStateDoesNotExist(
      bool birthStateExists,
      bool doesError
  )
    {
      // if 
      var child = new Child();
      if(birthStateExists)
      {
        child.BirthState = "New State";
      }

      // when
      var rule = new BirthStateRequired();
      var result = rule.Execute(child);

      // then
      Assert.Equal(doesError, result != null);
    }
  }
}