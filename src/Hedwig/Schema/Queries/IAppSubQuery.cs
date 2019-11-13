using System.Collections.Generic;
using GraphQL.Types;

namespace Hedwig.Schema.Queries
{
	public interface IAppSubQuery
	{
		IEnumerable<FieldType> Fields { get; }
	}
}
