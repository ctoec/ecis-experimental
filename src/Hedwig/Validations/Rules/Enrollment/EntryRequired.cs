using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class EntryRequired : FieldRequired<Enrollment>
  {
	public EntryRequired() : base("Entry")
	{ }
  }
}
