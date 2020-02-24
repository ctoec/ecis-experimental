using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class TownRequired : FieldRequired<Family>
  {
	public TownRequired() : base("Town")
	{ }
  }
}
