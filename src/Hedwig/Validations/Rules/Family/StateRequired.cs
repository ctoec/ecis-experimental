using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class StateRequired : FieldRequired<Family>
  {
	public StateRequired() : base("State")
	{ }
  }
}
