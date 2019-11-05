using Hedwig.Models;
using GraphQL.Types;
using System;
using GraphQL.DataLoader;
using Hedwig.Repositories;

namespace Hedwig.Schema.Types
{
	public class FamilyDeterminationType : TemporalGraphType<FamilyDetermination>
	{
		public FamilyDeterminationType(IDataLoaderContextAccessor dataLoader, IFamilyRepository families)
		{
			Field(d => d.Id);
			Field(d => d.NumberOfPeople);
			Field(d => d.Income);
			Field(d => d.Determined);
			Field<NonNullGraphType<FamilyType>>(
				"family",
				resolve: context => {
					DateTime? asOf = GetAsOfGlobal(context);
					String loaderCacheKey = $"GetChildByIdsAsync{asOf.ToString()}";
					var loader = dataLoader.Context.GetOrAddBatchLoader<int, Family>(
						loaderCacheKey,
						(ids) => families.GetFamiliesByIdsAsync(ids, asOf));
					return loader.LoadAsync(context.Source.FamilyId);
				}
			);
		}
	}
}
