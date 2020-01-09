using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class IfDisclosed_DeterminationDateRequired : ConditionalFieldRequired<FamilyDetermination>
  {
    public IfDisclosed_DeterminationDateRequired()
      : base("income is disclosed", "DeterminationDate", "Date of income determination")
    { }
    protected override bool CheckCondition(FamilyDetermination entity)
    {
      return !entity.NotDisclosed;
    }
  }
}