using ecis2.Models;
using GraphQL.Types;

namespace ecis2.Schema
{
	public class FundingType : ObjectGraphType<Funding>
	{
		public FundingType()
		{
			Field(f => f.Id);
			Field(f => f.Source, type: typeof(FundingSourceEnumType));
			Field(f => f.Entry);
			Field(f => f.Exit, nullable: true);
		}
	}
}
