using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class BirthCertificateIdRequired : FieldRequired<Child>
  {
	public BirthCertificateIdRequired() : base("BirthCertificateId")
	{ }
  }
}
