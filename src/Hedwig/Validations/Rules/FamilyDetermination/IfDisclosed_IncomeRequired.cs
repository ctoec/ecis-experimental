using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class IfDisclosed_IncomeRequired : ConditionalFieldRequired<FamilyDetermination>
  {
	public IfDisclosed_IncomeRequired()
	  : base("income is disclosed", "Income", "Annual household income")
	{ }
	protected override bool CheckCondition(FamilyDetermination entity)
	{
	  return !entity.NotDisclosed;
	}
  }
}
