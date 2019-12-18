using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class RaceRequired : OneOfFieldsRequired<Child>
  {
    public RaceRequired() : base(
      new string[] {
        "AmericanIndianOrAlaskaNative",
        "Asian",
        "BlackOrAfricanAmerican",
        "NativeHawaiianOrPacificIslander",
        "White"
      }
    )
    { }
  }
}