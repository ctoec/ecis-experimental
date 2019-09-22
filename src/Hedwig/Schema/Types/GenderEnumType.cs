using Hedwig.Models;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
	public class GenderEnumType : EnumerationGraphType<Gender>
	{
		public GenderEnumType()
		{
			Name = "Gender";
		}
	}
}
