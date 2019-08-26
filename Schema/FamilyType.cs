using ecis2.Models;
using ecis2.Repositories;
using GraphQL.DataLoader;
using GraphQL.Types;

namespace ecis2.Schema
{
	public class FamilyType : ObjectGraphType<Family>
	{
		public FamilyType(IDataLoaderContextAccessor dataLoader, IFamilyDeterminationRepository determinations)
		{
			Field(f => f.Id);
			Field<NonNullGraphType<ListGraphType<NonNullGraphType<FamilyDeterminationType>>>>(
				"determinations",
				resolve: context =>
				{
					var loader = dataLoader.Context.GetOrAddCollectionBatchLoader<int, FamilyDetermination>(
						"GetDeterminationsByFamilyIdsAsync",
						determinations.GetDeterminationsByFamilyIdsAsync);

					return loader.LoadAsync(context.Source.Id);
				}
			);
		}
	}
}
