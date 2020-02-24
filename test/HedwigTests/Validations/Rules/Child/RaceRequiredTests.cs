using Xunit;
using Hedwig.Models;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class RaceRequiredTests
  {
	[Theory]
	[InlineData(false, false, false, false, false, true)]
	[InlineData(true, false, false, false, false, false)]
	[InlineData(false, true, false, false, false, false)]
	[InlineData(false, false, true, false, false, false)]
	[InlineData(false, false, false, true, false, false)]
	[InlineData(false, false, false, false, true, false)]
	[InlineData(true, true, true, true, true, false)]
	public void Execute_ReturnsError_IfRaceDoesNotExist(
	  bool americanIndianOrAlaskNative,
	  bool asian,
	  bool blackOrAfricanAmerican,
	  bool nativeHawaiianOrPacificIslander,
	  bool white,
	  bool doesError
	)
	{
	  // if
	  var child = new Child
	  {
		AmericanIndianOrAlaskaNative = americanIndianOrAlaskNative,
		Asian = asian,
		BlackOrAfricanAmerican = blackOrAfricanAmerican,
		NativeHawaiianOrPacificIslander = nativeHawaiianOrPacificIslander,
		White = white
	  };

	  // when
	  var rule = new RaceRequired();
	  var result = rule.Execute(child);

	  // then
	  Assert.Equal(doesError, result != null);
	}
  }
}
