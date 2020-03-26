using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;

namespace Hedwig.Validations.Rules
{
	public class C4KCertificatesAreValid : SubObjectIsValid, IValidationRule<Child>
	{
		readonly public IC4KCertificateRepository _certificates;
		public C4KCertificatesAreValid(
			INonBlockingValidator validator,
			IC4KCertificateRepository certificates
		) : base(validator)
		{
			_certificates = certificates;
		}

		public ValidationError Execute(Child child, NonBlockingValidationContext context)
		{
			var certificates = _certificates.GetC4KCertificatesByChildId(child.Id);
			ValidateSubObject(certificates, child);
			if (certificates.Any(c => c.ValidationErrors.Count > 0))
			{
				return new ValidationError(
				field: "C4KCertificates",
				message: "C4KCertificates have validation errors",
				isSubObjectValidation: true
				);
			}

			return null;
		}
	}
}
