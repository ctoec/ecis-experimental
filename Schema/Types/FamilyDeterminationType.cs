using Hedwig.Models;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
	public class FamilyDeterminationType : ObjectGraphType<FamilyDetermination>
	{
		public FamilyDeterminationType()
		{
			Field(d => d.Id);
			Field(d => d.NumberOfPeople);
			Field(d => d.Income);
			Field(d => d.Determined);
		}
	}
}
