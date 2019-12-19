using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class FamilyIdRequired : FieldRequired<Child>
  {
    public FamilyIdRequired() : base("FamilyId")
    { }
  }
}