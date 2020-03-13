using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Validations.Rules
{
	public class EnrollmentsAreValid : SubObjectIsValid, IValidationRule<Child>
	{
		readonly IEnrollmentRepository _enrollments;

		public EnrollmentsAreValid(
			INonBlockingValidator validator,
			IEnrollmentRepository enrollments
		) : base(validator)
		{
			_enrollments = enrollments;
		}

		public ValidationError Execute(Child child, NonBlockingValidationContext context)
		{
			// Do not do child.Enrollment validations if validation happening in context of enrollment parent
			if(context.GetParentEntity<Enrollment>() != null)
			{
				return null;
			}

			var enrollments = child.Enrollments ?? _enrollments.GetEnrollmentsByChildId(child.Id);
			foreach (var enrollment in enrollments)
			{
				ValidateSubObject(enrollment, child);
				if(enrollment.ValidationErrors.Count > 0)
				{
					return new ValidationError(
						field: "Enrollments",
						message: "Enrollments has validation errors",
						isSubObjectValidation: true
					);
				}
			}

			return null;
		}
	}
}
