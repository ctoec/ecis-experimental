using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class BirthdateRequired : FieldRequired<Child>
  {
    public BirthdateRequired() : base("Birthdate")
    { }
  }
}