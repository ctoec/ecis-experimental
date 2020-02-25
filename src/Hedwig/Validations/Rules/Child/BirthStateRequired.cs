using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class BirthStateRequired : FieldRequired<Child>
	{
		public BirthStateRequired() : base("BirthState")
		{ }
	}
}
