using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class FamilyCertificateIdRequired : FieldRequired<Child>
	{
		public FamilyCertificateIdRequired() : base("FamilyCertificateId")
		{ }
	}
}
