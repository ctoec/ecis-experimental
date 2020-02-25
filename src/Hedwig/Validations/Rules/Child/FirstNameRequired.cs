using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class FirstNameRequired : FieldRequired<Child>
	{
		public FirstNameRequired() : base("FirstName")
		{ }
	}
}
