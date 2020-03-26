using Hedwig.Models;
using Hedwig.Repositories;
using System;

namespace Hedwig.Validations.Rules
{
	public class FundingsAreValid : SubObjectIsValid, IValidationRule<Enrollment>
	{
		readonly IFundingRepository _fundings;
		public FundingsAreValid(
			INonBlockingValidator validator,
			IFundingRepository fundings
		) : base(validator)
		{
			_fundings = fundings;
		}

		public ValidationError Execute(Enrollment enrollment, NonBlockingValidationContext context)
		{
			if (enrollment == null)
			{
				return null;
			}

			var fundings = enrollment.Fundings ?? _fundings.GetFundingsByEnrollmentId(enrollment.Id);
			var hasValidationErrors = false;
			foreach (var funding in fundings)
			{
				ValidateSubObject(funding, enrollment);
				if (funding.ValidationErrors.Count > 0)
				{
					hasValidationErrors = true;
				}
			}

			if (hasValidationErrors)
			{
				return new ValidationError(
				field: "Fundings",
				message: "Fundings has validation errors",
				isSubObjectValidation: true
				);
			}

			return null;
		}
	}
}
