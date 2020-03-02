using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class IfEnrollmentEntry_FirstReportingPeriodIdRequired : IValidationRule<Funding>
	{
		public ValidationError Execute(Funding funding, NonBlockingValidationContext context)
		{
			if (funding.Source == FundingSource.CDC)
			{
				var enrollment = (Enrollment) context.ParentEntity;
				if (enrollment.Entry.HasValue && !funding.FirstReportingPeriodId.HasValue)
				{
					return new ValidationError(
					field: "FirstReportingPeriod",
					message: "First reporting period is required for funding on enrollments with start dates"
					);
				}
			}

			return null;
		}
	}
}
