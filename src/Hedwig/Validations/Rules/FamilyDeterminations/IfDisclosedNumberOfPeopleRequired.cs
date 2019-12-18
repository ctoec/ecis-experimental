using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class IfDisclosedNumberOfPeopleRequired : ConditionalFieldRequired<FamilyDetermination>
  {
    public IfDisclosedNumberOfPeopleRequired()
      : base("NumberOfPeople", "income is disclosed")
    { }
    protected override bool CheckCondition(FamilyDetermination entity)
    {
      return !entity.NotDisclosed;
    }
  }
}