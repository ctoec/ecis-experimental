using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class AgeGroupRequired : FieldRequired<Enrollment>
  {
    public AgeGroupRequired() : base("AgeGroup")
    { }
  }
}