using Xunit;
using Hedwig.Models;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class FamilyIdRequiredTests
  {
	[Theory]
	[InlineData(true, false)]
	[InlineData(false, true)]
	public void Execute_ReturnsError_IfFamilyIdDoesNotExist(
	  bool familyIdExists,
	  bool doesError
	)
	{
	  // if 
	  var child = new Child();
	  if (familyIdExists)
	  {
		child.FamilyId = 1;
	  }

	  // when
	  var rule = new FamilyIdRequired();
	  var result = rule.Execute(child);

	  // then
	  Assert.Equal(doesError, result != null);
	}
  }
}
