using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class EthnicityRequired : FieldRequired<Child>
  {
	public EthnicityRequired() : base("HispanicOrLatinxEthnicity")
	{ }
  }
}
