using System;
using Hedwig.Models;
using Hedwig.Repositories;
using GraphQL;
using GraphQL.DataLoader;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
	public class SiteType : TemporalGraphType<Site>
	{
		public SiteType(IDataLoaderContextAccessor dataLoader, IEnrollmentRepository enrollments)
		{
			Field(s => s.Id);
			Field(s => s.Name);
			Field<NonNullGraphType<ListGraphType<NonNullGraphType<EnrollmentType>>>>(
				"enrollments",
				arguments: new QueryArguments(
					new QueryArgument<DateGraphType> { Name = "from" },
					new QueryArgument<DateGraphType> { Name = "to" }
				),
				resolve: context =>
				{
					var from = context.GetArgument<DateTime?>("from");
					var to = context.GetArgument<DateTime?>("to");
					if(!ValidateQueryArguments(from, to)) {
						throw new ExecutionError("Both from and to must be supplied");
					} 

					DateTime? asOf = GetAsOfGlobal(context);
					String loaderCacheKey = $"GetEnrollmentsBySiteIdsAsync{asOf.ToString()}{from.ToString()}{to.ToString()}";
					var loader = dataLoader.Context.GetOrAddCollectionBatchLoader<int, Enrollment>(
						loaderCacheKey,
						(ids) => enrollments.GetEnrollmentsBySiteIdsAsync(ids, asOf, from, to));
					return loader.LoadAsync(context.Source.Id);
				}
			);
		}
        private static Boolean ValidateQueryArguments(DateTime? from, DateTime? to)
		{
			if(from.HasValue && to.HasValue) return true;
			if(!from.HasValue && !to.HasValue) return true;
			return false;	
		}
	}
}
