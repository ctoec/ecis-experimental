using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class IfDisclosedDeterminationDateRequired : ConditionalFieldRequired<FamilyDetermination>
  {
    public IfDisclosedDeterminationDateRequired()
      : base("income is disclosed", "DeterminationDate", "Date of income determination")
    { }
    protected override bool CheckCondition(FamilyDetermination entity)
    {
      return !entity.NotDisclosed;
    }
  }
}