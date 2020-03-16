using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class CertificateStartDateRequired : FieldRequired<Child>
	{
		public CertificateStartDateRequired() : base("StartDate")
		{ }
	}
}
