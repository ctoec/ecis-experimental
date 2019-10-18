using Hedwig.Schema.Queries;
using GraphQL.Types;
using System.Collections.Generic;

namespace Hedwig.Schema
{
	public class AppQuery : ObjectGraphType<object>
	{
		public AppQuery(IEnumerable<IAppSubQuery> appSubQueries)
		{
			foreach(var subquery in appSubQueries) {
				foreach(var field in subquery.Fields) {
					AddField(field);
				}
			}
		}
	}

}
