using Hedwig.Models;
using GraphQL.Types;

public class FundingSourceEnumType : EnumerationGraphType<FundingSource>
{
	public FundingSourceEnumType()
	{
		Name = "FundingSource";
	}
}
