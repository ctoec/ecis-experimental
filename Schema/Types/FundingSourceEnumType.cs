using Hedwig.Models;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
	public class FundingSourceEnumType : EnumerationGraphType<FundingSource>
	{
		public FundingSourceEnumType()
		{
			Name = "FundingSource";
		}
	}
}
