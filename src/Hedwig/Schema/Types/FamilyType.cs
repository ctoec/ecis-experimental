using Hedwig.Models;
using Hedwig.Repositories;
using GraphQL.DataLoader;
using GraphQL.Types;
using System;

namespace Hedwig.Schema.Types
{
	public class FamilyType : TemporalGraphType<Family>
	{
		public FamilyType(IDataLoaderContextAccessor dataLoader, IFamilyDeterminationRepository determinations)
		{
			Field(f => f.Id);
			Field(f => f.CaseNumber, type: typeof(IntGraphType));
			Field<NonNullGraphType<ListGraphType<NonNullGraphType<FamilyDeterminationType>>>>(
				"determinations",
				resolve: context =>
				{
					DateTime? asOf = GetAsOfGlobal(context);
					String loaderCacheKey = $"GetDeterminationsByFamilyIdsAsync{asOf.ToString()}";

					var loader = dataLoader.Context.GetOrAddCollectionBatchLoader<int, FamilyDetermination>(
						loaderCacheKey,
						(ids) => {
							return determinations.GetDeterminationsByFamilyIdsAsync(ids, asOf);
						}
					);

					return loader.LoadAsync(context.Source.Id);
				}
			);
		}
	}
}
