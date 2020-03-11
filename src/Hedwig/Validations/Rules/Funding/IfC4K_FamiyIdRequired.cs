using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class IfC4K_FamilyIdRequired : ConditionalFieldRequired<Funding>
	{
		public IfC4K_FamilyIdRequired()
			: base("source is Care 4 Kids", "FamilyId")
		{ }

		protected override bool CheckCondition(Funding entity, NonBlockingValidationContext context)
		{
			return entity.Source == FundingSource.C4K;
		}
	}
}
