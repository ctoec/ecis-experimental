using Hedwig.Models;
using Hedwig.Repositories;
using GraphQL.DataLoader;
using GraphQL.Types;

namespace Hedwig.Schema
{
	public class SiteType : ObjectGraphType<Site>
	{
		public SiteType(IDataLoaderContextAccessor dataLoader, IEnrollmentRepository enrollments)
		{
			Field(s => s.Id);
			Field(s => s.Name);
			Field<NonNullGraphType<ListGraphType<NonNullGraphType<EnrollmentType>>>>(
				"enrollments",
				resolve: context =>
				{
					var loader = dataLoader.Context.GetOrAddCollectionBatchLoader<int, Enrollment>(
						"GetEnrollmentsBySiteIdsAsync",
						enrollments.GetEnrollmentsBySiteIdsAsync);

					return loader.LoadAsync(context.Source.Id);
				}
			);
		}
	}
}
