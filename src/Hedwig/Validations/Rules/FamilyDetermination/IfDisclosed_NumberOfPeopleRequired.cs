using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class IfDisclosed_NumberOfPeopleRequired : ConditionalFieldRequired<FamilyDetermination>
	{
		public IfDisclosed_NumberOfPeopleRequired()
			: base("income is disclosed", "NumberOfPeople", "Household size")
		{ }
		protected override bool CheckCondition(FamilyDetermination entity)
		{
			return !entity.NotDisclosed;
		}
	}
}
