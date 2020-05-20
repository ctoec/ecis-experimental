using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class NumberOfPeopleRequired : FieldRequired<FamilyDetermination>
	{
		public NumberOfPeopleRequired()
			:base("NumberOfPeople")
		{ }
	}
}
