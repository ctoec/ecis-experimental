using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class IfDisclosedIncomeRequired : ConditionalFieldRequired<FamilyDetermination>
  {
    public IfDisclosedIncomeRequired()
      : base("Income", "income is disclosed")
    { }
    protected override bool CheckCondition(FamilyDetermination entity)
    {
      return !entity.NotDisclosed;
    }
  }
}