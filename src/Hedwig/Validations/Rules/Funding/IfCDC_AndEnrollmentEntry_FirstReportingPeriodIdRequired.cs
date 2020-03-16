using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class IfEnrollmentEntry_FirstReportingPeriodIdRequired : ConditionalFieldRequired<Funding>
	{
		public IfEnrollmentEntry_FirstReportingPeriodIdRequired()
			: base("Enrollment has entry date", "FirstReportingPeriod", "First reporting period")
		{ }

		protected override bool CheckCondition(Funding entity, NonBlockingValidationContext context)
		{
			var enrollment = context.GetParentEntity<Enrollment>();
			return entity.Source == FundingSource.CDC
				&& (enrollment.Entry.HasValue && !entity.FirstReportingPeriodId.HasValue);
		}
	}
}
