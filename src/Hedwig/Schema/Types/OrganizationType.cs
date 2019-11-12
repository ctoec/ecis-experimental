using System;
using Hedwig.Models;
using Hedwig.Repositories;
using GraphQL;
using GraphQL.DataLoader;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
	public class OrganizationType : ObjectGraphType<Organization>
	{
		public OrganizationType(IDataLoaderContextAccessor dataLoader, ISiteRepository sites)
		{
			Field(o => o.Id);
			Field(o => o.Name);
			Field<NonNullGraphType<ListGraphType<NonNullGraphType<SiteType>>>>(
				"sites",
				resolve: context =>
				{
					var loader = dataLoader.Context.GetOrAddCollectionBatchLoader<int, Site>(
						"GetSitesByOrganizationIdsAsync",
						(ids) => sites.GetSitesByOrganizationIdsAsync(ids));

					return loader.LoadAsync(context.Source.Id);
				}
			);
		}
	}
}
