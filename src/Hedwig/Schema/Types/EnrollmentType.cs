using System;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Security;
using GraphQL.DataLoader;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
	public class EnrollmentType : TemporalGraphType<Enrollment>, IAuthorizedGraphType
	{
		public EnrollmentType(IDataLoaderContextAccessor dataLoader, IChildRepository children, IFundingRepository fundings)
		{
			Field(e => e.Id);
			Field<DateTime>(e => e.Entry);
			Field<DateTime?>(e => e.Exit, nullable: true);
			Field<NonNullGraphType<ChildType>>(
				"child",
				resolve: context =>
				{
					DateTime? asOf = GetAsOfGlobal(context);
					String loaderCacheKey = $"GetChildByIdsAsync{asOf.ToString()}";
					var loader = dataLoader.Context.GetOrAddBatchLoader<Guid, Child>(
						loaderCacheKey,
						(ids) => children.GetChildrenByIdsAsync(ids, asOf));

					return loader.LoadAsync(context.Source.ChildId);
				}
			);
			Field<NonNullGraphType<ListGraphType<NonNullGraphType<FundingType>>>>(
				"fundings",
				resolve: context =>
				{
					DateTime? asOf = GetAsOfGlobal(context);
					String loaderCacheKey = $"GetFundingsByEnrollmentIdsAsync{asOf.ToString()}";
					var loader = dataLoader.Context.GetOrAddCollectionBatchLoader<int, Funding>(
						loaderCacheKey,
						(ids) => fundings.GetFundingsByEnrollmentIdsAsync(ids, asOf));

					return loader.LoadAsync(context.Source.Id);
				}
			);
		}

		public AuthorizationRules Permissions(AuthorizationRules rules)
		{
			rules.DenyNot("IsAuthenticatedUserPolicy");
			rules.Allow("IsDeveloperInDevPolicy");
			rules.Allow("IsTestModePolicy");
			rules.Deny();
			return rules;
		}
	}
}
