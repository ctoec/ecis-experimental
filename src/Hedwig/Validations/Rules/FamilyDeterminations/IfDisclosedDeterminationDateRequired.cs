using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class IfDisclosedDeterminationDateRequired : ConditionalFieldRequired<FamilyDetermination>
  {
    public IfDisclosedDeterminationDateRequired(): base("DeterminationDate")
    { }
    protected override bool CheckCondition(FamilyDetermination entity)
    {
      return !entity.NotDisclosed;
    }
  }
}