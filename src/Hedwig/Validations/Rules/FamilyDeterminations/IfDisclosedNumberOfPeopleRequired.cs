using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class IfDisclosedNumberOfPeopleRequired : ConditionalFieldRequired<FamilyDetermination>
  {
    public IfDisclosedNumberOfPeopleRequired()
      : base("income is disclosed", "NumberOfPeople", "Household size")
    { }
    protected override bool CheckCondition(FamilyDetermination entity)
    {
      return !entity.NotDisclosed;
    }
  }
}