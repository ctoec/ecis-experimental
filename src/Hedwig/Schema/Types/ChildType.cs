using System;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Security;
using GraphQL.DataLoader;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
	public class ChildType : TemporalGraphType<Child>, IAuthorizedGraphType
	{
		public ChildType(IDataLoaderContextAccessor dataLoader, IFamilyRepository families)
		{
			Field(c => c.Id, type: typeof(NonNullGraphType<IdGraphType>));
			Field(c => c.FirstName);
			Field(c => c.MiddleName, nullable: true);
			Field(c => c.LastName);
			Field(c => c.Suffix, nullable: true);
			Field(c => c.Birthdate, type: typeof(DateGraphType), nullable: true);
			Field(c => c.BirthCertificateId, nullable: true);
			Field(c => c.BirthTown, nullable: true);
			Field(c => c.BirthState, nullable: true);
			Field(c => c.Gender, type: typeof(GenderEnumType), nullable: true);
			Field(c => c.AmericanIndianOrAlaskaNative);
			Field(c => c.Asian);
			Field(c => c.BlackOrAfricanAmerican);
			Field(c => c.NativeHawaiianOrPacificIslander);
			Field(c => c.White);
			Field(c => c.HispanicOrLatinxEthnicity);
			Field(c => c.Foster);
			Field<FamilyType>(
				"family",
				resolve: context =>
				{
					if (!context.Source.FamilyId.HasValue) { return null; }

					var familyId = context.Source.FamilyId.Value;
	 				var asOf = GetAsOfGlobal(context);
					String loaderCacheKey = $"GetFamiliesByIdsAsync{asOf.ToString()}";

					var loader = dataLoader.Context.GetOrAddBatchLoader<int, Family>(
						loaderCacheKey,
						(ids) => families.GetFamiliesByIdsAsync(ids, asOf));

					return loader.LoadAsync(familyId);
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
