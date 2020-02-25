using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class SourceRequired : FieldRequired<Funding>
	{
		public SourceRequired() : base("Source")
		{ }
	}
}
