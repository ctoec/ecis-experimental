using Xunit;
using Hedwig.Models;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class AgeGroupRequiredTests
  {
	[Theory]
	[InlineData(true, false)]
	[InlineData(false, true)]
	public void Execute_ReturnsError_IfAgeGroupDoesNotExist(
	  bool ageGroupExists,
	  bool doesError
	)
	{
	  // if
	  var enrollment = new Enrollment();
	  if (ageGroupExists)
	  {
		enrollment.AgeGroup = Age.InfantToddler;
	  }

	  // when
	  var rule = new AgeGroupRequired();
	  var result = rule.Execute(enrollment);

	  // then
	  Assert.Equal(doesError, result != null);
	}
  }
}
