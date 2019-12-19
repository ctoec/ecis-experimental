using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class IfDisclosedIncomeRequired : ConditionalFieldRequired<FamilyDetermination>
  {
    public IfDisclosedIncomeRequired()
      : base("income is disclosed", "Income", "Annual household income")
    { }
    protected override bool CheckCondition(FamilyDetermination entity)
    {
      return !entity.NotDisclosed;
    }
  }
}