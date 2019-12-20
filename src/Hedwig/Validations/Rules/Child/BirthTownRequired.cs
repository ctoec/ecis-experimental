using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class BirthTownRequired : FieldRequired<Child>
  {
    public BirthTownRequired() : base("BirthTown")
    {}
  }
}