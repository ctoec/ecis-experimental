using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class CertificateStartDateRequired : FieldRequired<C4KCertificate>
	{
		public CertificateStartDateRequired() : base("StartDate")
		{ }
	}
}
