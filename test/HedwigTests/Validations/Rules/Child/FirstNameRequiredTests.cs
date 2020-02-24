using Xunit;
using Hedwig.Models;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class FirstNameRequiredTests
  {
	[Theory]
	[InlineData(true, false)]
	[InlineData(false, true)]
	public void Execute_ReturnsError_IfFirstNameDoesNotExist(
	  bool firstNameExists,
	  bool doesError
	)
	{
	  // if 
	  var child = new Child();
	  if (firstNameExists)
	  {
		child.FirstName = "First";
	  }

	  // when
	  var rule = new FirstNameRequired();
	  var result = rule.Execute(child);

	  // then
	  Assert.Equal(doesError, result != null);
	}
  }
}
