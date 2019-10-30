using Hedwig.Models;
using Hedwig.Repositories;
using GraphQL.DataLoader;
using GraphQL.Types;
using System;

namespace Hedwig.Schema.Types
{
	public class FamilyType : TemporalGraphType<Family>
	{
		public FamilyType(IDataLoaderContextAccessor dataLoader, IChildRepository children, IFamilyDeterminationRepository determinations)
		{
			Field(f => f.Id);
			Field<NonNullGraphType<ListGraphType<NonNullGraphType<ChildType>>>>(
				"children",
				resolve: context =>
				{
					DateTime? asOf = GetAsOfGlobal(context);
					String loaderCacheKey = $"GetChildrenByFamilyIdsAsync{asOf.ToString()}";

					var loader = dataLoader.Context.GetOrAddCollectionBatchLoader<int, Child>(
						loaderCacheKey,
						(ids) => children.GetChildrenByFamilyIdsAsync(ids, asOf)
					);

					return loader.LoadAsync(context.Source.Id);
				}
			);
			Field(f => f.AddressLine1, type: typeof(StringGraphType));
			Field(f => f.AddressLine2, type: typeof(StringGraphType));
			Field(f => f.Town, type: typeof(StringGraphType));
			Field(f => f.State, type: typeof(StringGraphType));
			Field(f => f.Zip, type: typeof(StringGraphType));
			Field(f => f.Homelessness);
			Field<NonNullGraphType<ListGraphType<NonNullGraphType<FamilyDeterminationType>>>>(
				"determinations",
				resolve: context =>
				{
					DateTime? asOf = GetAsOfGlobal(context);
					String loaderCacheKey = $"GetDeterminationsByFamilyIdsAsync{asOf.ToString()}";

					var loader = dataLoader.Context.GetOrAddCollectionBatchLoader<int, FamilyDetermination>(
						loaderCacheKey,
						(ids) => determinations.GetDeterminationsByFamilyIdsAsync(ids, asOf)
					);

					return loader.LoadAsync(context.Source.Id);
				}
			);
		}
	}
}
