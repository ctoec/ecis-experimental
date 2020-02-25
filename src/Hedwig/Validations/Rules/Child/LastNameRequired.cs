using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class LastNameRequired : FieldRequired<Child>
	{
		public LastNameRequired() : base("LastName")
		{ }
	}
}
