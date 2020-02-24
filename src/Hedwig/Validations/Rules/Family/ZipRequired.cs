using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class ZipRequired : FieldRequired<Family>
  {
	public ZipRequired() : base("Zip", "Zipcode")
	{ }
  }
}
