using Hedwig.Models;
using GraphQL.Types;
using GraphQL.DataLoader;
using Hedwig.Repositories;
using Hedwig.Security;

namespace Hedwig.Schema.Types
{
	public class FundingType : TemporalGraphType<Funding>
	{
		public FundingType(IDataLoaderContextAccessor dataLoader, IEnrollmentRepository enrollments)
		{
			Field(f => f.Id);
			Field(f => f.Source, type: typeof(NonNullGraphType<FundingSourceEnumType>));
			Field(f => f.Time, type: typeof(NonNullGraphType<FundingTimeEnumType>));
			Field<EnrollmentType>(
				"enrollment",
				resolve: context => 
				{
					var enrollmentId = context.Source.EnrollmentId;
					var asOf = GetAsOfGlobal(context);
					var loaderCacheKey = $"GetEnrollmentsByIdsAsync{asOf.ToString()}";

					var loader = dataLoader.Context.GetOrAddBatchLoader<int,Enrollment>(
						loaderCacheKey,
						(ids) => enrollments.GetEnrollmentsByIdsAsync(ids, asOf)
					);
					return loader.LoadAsync(enrollmentId);
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
