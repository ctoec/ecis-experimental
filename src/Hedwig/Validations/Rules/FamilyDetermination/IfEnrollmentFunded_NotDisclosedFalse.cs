using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;

namespace Hedwig.Validations.Rules
{
	public class IfEnrollmentFunded_NotDeterminedFalse : IValidationRule<FamilyDetermination>
	{
		private readonly IFundingRepository _fundings;
		public IfEnrollmentFunded_NotDeterminedFalse(
			IFundingRepository fundings
		)
		{
			_fundings = fundings;
		}

		public ValidationError Execute(FamilyDetermination determination, NonBlockingValidationContext context)
		{
			var enrollment = context.GetParentEntity<Enrollment>();
			if (enrollment == null) return null;

			var fundings = enrollment.Fundings ?? _fundings.GetFundingsByEnrollmentId(enrollment.Id);
			if (fundings.Any(f => f.Source == FundingSource.CDC)
			&& determination.NotDisclosed)
			{
				return new ValidationError(
					field: "NotDisclosed",
					message: "Income determination must be disclosed for funded enrollments"
				);
			}

			return null;
		}
	}
}
