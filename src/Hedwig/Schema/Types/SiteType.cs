using System;
using Hedwig.Models;
using Hedwig.Repositories;
using GraphQL;
using GraphQL.DataLoader;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
	public class SiteType : ObjectGraphType<Site>
	{
		public SiteType(IDataLoaderContextAccessor dataLoader, IEnrollmentRepository enrollments)
		{
			Field(s => s.Id);
			Field(s => s.Name);
			Field<NonNullGraphType<ListGraphType<NonNullGraphType<EnrollmentType>>>>(
				"enrollments",
				// Add arguments to subfield because graphql does not support
				// using top-level queries on a subfield.
				arguments: new QueryArguments(
					new QueryArgument<DateGraphType> { Name = "from" },
					new QueryArgument<DateGraphType> { Name = "to" }
				),
				resolve: context =>
				{
					// dynamically determine which query to use
					// depending on supplied parameters
					var query = enrollments.GetQuery();
					String queryName;
					var from = context.GetArgument<DateTime?>("from");
					var to = context.GetArgument<DateTime?>("to");

					if (!from.HasValue && !to.HasValue) {
						queryName = "GetEnrollmentsBySiteIdsAsync";
					} else if (!from.HasValue || !to.HasValue) {
						throw new ExecutionError("Both from and to must be supplied");
					} else {
						query = enrollments.FilterByDates(query, (DateTime)from, (DateTime)to);
						queryName = "GetEnrollmentsBySideIdsFilteredByDatesAsync";
					}
						
					var loader = dataLoader.Context.GetOrAddCollectionBatchLoader<int, Enrollment>(
						queryName,
						(ids) => enrollments.GetEnrollmentsBySiteIdsAsync(query, ids));

					return loader.LoadAsync(context.Source.Id);
				}
			);
		}
	}
}
