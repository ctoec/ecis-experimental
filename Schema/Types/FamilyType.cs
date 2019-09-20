using Hedwig.Models;
using Hedwig.Repositories;
using GraphQL.DataLoader;
using GraphQL.Types;

namespace Hedwig.Schema.Types
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
