using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class AddressLine1Required : FieldRequired<Family>
  {
    public AddressLine1Required() : base("AddressLine1")
    { }
  }
}