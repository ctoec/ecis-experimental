using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class IncomeRequired : FieldRequired<FamilyDetermination>
	{
		public IncomeRequired()
			: base("Income", "Annual household income")
		{ }
	}
}
