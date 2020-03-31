using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class IfC4K_C4KFamilyCaseNumberRequired : ConditionalFieldRequired<Child>
	{
		public IfC4K_C4KFamilyCaseNumberRequired()
			: base("child has c4k funding", "C4KFamilyCaseNumber", "C4K Family Case Number")
		{ }

		protected override bool CheckCondition(Child entity, NonBlockingValidationContext context)
		{
			return entity.C4KCertificates != null && entity.C4KCertificates.Count != 0;
		}
	}
}
