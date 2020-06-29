using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class IfEndDateNull_StartDateRequired : ConditionalFieldRequired<C4KCertificate>
	{
		public IfEndDateNull_StartDateRequired()
			: base("certificate does not have end date", "StartDate", "Start date")
		{ }

		protected override bool CheckCondition(C4KCertificate entity, NonBlockingValidationContext context)
		{
			return !entity.EndDate.HasValue;
		}
	}
}
