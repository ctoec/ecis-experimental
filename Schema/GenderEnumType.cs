using Hedwig.Models;
using GraphQL.Types;

public class GenderEnumType : EnumerationGraphType<Gender>
{
	public GenderEnumType()
	{
		Name = "Gender";
	}
}
