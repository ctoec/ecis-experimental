using Xunit;
using Hedwig.Models;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class EthnicityRequiredTests
  {
    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public void Execute_ReturnsError_IfEthnicityDoesNotExist(
      bool ethnicityExists,
      bool doesError
    )
    {
      // if 
      var child = new Child();
      if(ethnicityExists)
      {
        child.HispanicOrLatinxEthnicity = true;
      }

      // when
      var rule = new EthnicityRequired();
      var result = rule.Execute(child);

      // then
      Assert.Equal(doesError, result != null);
    }
  }
}