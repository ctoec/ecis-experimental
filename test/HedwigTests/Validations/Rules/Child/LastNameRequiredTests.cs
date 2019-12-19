using Xunit;
using Hedwig.Models;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class LastNameRequiredTests
  {
    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public void Execute_ReturnsError_IfLastNameDoesNotExist(
      bool lastNameExists,
      bool doesError
    )
    {
      // if 
      var child = new Child();
      if(lastNameExists)
      {
        child.LastName = "Last";
      }

      // when
      var rule = new LastNameRequired();
      var result = rule.Execute(child);

      // then
      Assert.Equal(doesError, result != null);
    }
  }
}