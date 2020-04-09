using Hedwig.Models;
using Hedwig.Repositories;
using System.Collections.Generic;

namespace Hedwig.Validations.Rules
{
	public class FamilyIsValid : SubObjectIsValid, IValidationRule<Child>
	{
		readonly IFamilyRepository _families;

		public FamilyIsValid(
			INonBlockingValidator validator,
			IFamilyRepository families
		) : base(validator)
		{
			_families = families;
		}

		public ValidationError Execute(Child child, NonBlockingValidationContext context)
		{
			if (child.FamilyId.HasValue)
			{
				var family = child.Family ?? _families.GetFamilyByIdAsNoTracking(child.FamilyId.Value);

				ValidateSubObject(family, child);
				if (family.ValidationErrors.Count > 0)
				{
					return new ValidationError(
					field: "Family",
					message: "Family has validation errors",
					isSubObjectValidation: true
					);
				}
			}

			return null;
		}
	}
}
