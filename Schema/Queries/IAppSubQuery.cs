using System.Collections.Generic;
using GraphQL.Types;

namespace Hedwig.Schema
{
	public interface IAppSubQuery
	{
		IEnumerable<FieldType> Fields { get; }
	}
}
