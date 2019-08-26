using ecis2.Models;
using GraphQL.Types;

namespace ecis2.Schema
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
