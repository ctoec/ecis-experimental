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
        public EnrollmentType(IDataLoaderContextAccessor dataLoader, IChildRepository children, IFundingRepository fundings, ISiteRepository sites)
        {
            Field(e => e.Id);
            Field<DateTime?>(e => e.Entry, type: typeof(DateGraphType), nullable: true);
            Field<DateTime?>(e => e.Exit, type: typeof(DateGraphType), nullable: true);
            Field(e => e.Age, type: typeof(AgeEnumType));
            Field<NonNullGraphType<ChildType>>(
                "child",
                resolve: context =>
                {
                    DateTime? asOf = GetAsOfGlobal(context);
                    String loaderCacheKey = $"GetChildByIdsAsync{asOf.ToString()}";
                    var loader = dataLoader.Context.GetOrAddBatchLoader<Guid, Child>(
                        loaderCacheKey,
                        (ids) => children.GetChildrenByIdsAsync_OLD(ids, asOf));

                    return loader.LoadAsync(context.Source.ChildId);
                }
            );
            Field<NonNullGraphType<SiteType>>(
                "site",
                resolve: context =>
                {
                    var loader = dataLoader.Context.GetOrAddBatchLoader<int, Site>(
                        "GetSitesByIdsAsync",
                        (ids) => sites.GetSitesByIdsAsync(ids));

                    return loader.LoadAsync(context.Source.SiteId);
                }
            );
            FieldAsync<NonNullGraphType<ListGraphType<NonNullGraphType<FundingType>>>>(
                "fundings",
                resolve: async context =>
                {
                    DateTime? asOf = GetAsOfGlobal(context);
                    String loaderCacheKey = $"GetFundingsByEnrollmentIdsAsync{asOf.ToString()}";
                    var loader = dataLoader.Context.GetOrAddCollectionBatchLoader<int, Funding>(
                        loaderCacheKey,
                        async (ids) => await fundings.GetFundingsByEnrollmentIdsAsync(ids, asOf));

                    return await loader.LoadAsync(context.Source.Id);
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
