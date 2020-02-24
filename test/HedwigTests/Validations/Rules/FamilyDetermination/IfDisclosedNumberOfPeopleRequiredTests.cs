using Xunit;
using Hedwig.Models;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class IfDisclosedNumberOfPeopleRequiredTests
  {
	[Theory]
	[InlineData(true, true, false)]
	[InlineData(false, false, false)]
	[InlineData(true, false, true)]
	public void Execute_ReturnsError_IfDisclosedAndNumberOfPeopleDoesNotExist(
	  bool disclosed,
	  bool numberOfPeopleExists,
	  bool doesError
	)
	{
	  // if 
	  var determination = new FamilyDetermination
	  {
		NotDisclosed = !disclosed,
	  };

	  if (numberOfPeopleExists)
	  {
		determination.NumberOfPeople = 5;
	  }

	  // when
	  var rule = new IfDisclosed_NumberOfPeopleRequired();
	  var result = rule.Execute(determination);

	  // then
	  Assert.Equal(doesError, result != null);
	}
  }
}
