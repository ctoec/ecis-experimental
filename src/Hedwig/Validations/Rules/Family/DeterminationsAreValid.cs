using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;

namespace Hedwig.Validations.Rules
{
	public class DeterminationsAreValid : SubObjectIsValid, IValidationRule<Family>
	{
		readonly IFamilyDeterminationRepository _determinations;

		public DeterminationsAreValid(
			INonBlockingValidator validator,
			IFamilyDeterminationRepository determinations
		) : base(validator)
		{
			_determinations = determinations;
		}

		public ValidationError Execute(Family family, NonBlockingValidationContext context)
		{
			var child = context.GetParentEntity<Child>();

			// Enrollments for children living with foster families
			// are exempt from family determination validations
			if (child != null && !child.Foster && family != null)
			{
				var determinations = family.Determinations ?? _determinations.GetDeterminationsByFamilyId(family.Id);
				ValidateSubObject(determinations, family);
				if(determinations.Any(det => det.ValidationErrors.Count > 0))
				{
					return new ValidationError(
						field: "Determinations",
						message: "Determinations has validation error",
						isSubObjectValidation: true
					);
				}
			}

			return null;
		}
	}
}
