using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class DeterminationDateRequired : FieldRequired<FamilyDetermination>
	{
		public DeterminationDateRequired()
			: base("DeterminationDate", "Date of income determination")
		{ }
	}
}
