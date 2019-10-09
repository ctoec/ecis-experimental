using Hedwig.Models;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
	public class FundingType : HedwigGraphType<Funding>
	{
		public FundingType()
		{
			Field(f => f.Id);
			Field(f => f.Source, type: typeof(NonNullGraphType<FundingSourceEnumType>));
			Field(f => f.Entry);
			Field(f => f.Exit, nullable: true);
		}
	}
}
