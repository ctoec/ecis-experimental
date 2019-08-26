using ecis2.Models;
using ecis2.Repositories;
using GraphQL.DataLoader;
using GraphQL.Types;

namespace ecis2.Schema
{
	public class ChildType : ObjectGraphType<Child>
	{
		public ChildType(IDataLoaderContextAccessor dataLoader, IFamilyRepository families)
		{
			Field(c => c.Id, type: typeof(NonNullGraphType<IdGraphType>));
			Field(c => c.FirstName);
			Field(c => c.MiddleName, nullable: true);
			Field(c => c.LastName);
			Field(c => c.Suffix, nullable: true);
			Field(c => c.Birthdate);
			Field(c => c.Gender, type: typeof(NonNullGraphType<GenderEnumType>));
			Field(c => c.AmericanIndianOrAlaskaNative, nullable: true);
			Field(c => c.Asian, nullable: true);
			Field(c => c.BlackOrAfricanAmerican, nullable: true);
			Field(c => c.NativeHawaiianOrPacificIslander, nullable: true);
			Field(c => c.White, nullable: true);
			Field(c => c.HispanicOrLatinxEthnicity, nullable: true);
			Field<FamilyType>(
				"family",
				resolve: context =>
				{
					if (!context.Source.FamilyId.HasValue) { return null; }

					var familyId = context.Source.FamilyId.Value;

					var loader = dataLoader.Context.GetOrAddBatchLoader<int, Family>(
						"GetFamiliesByIdsAsync",
						families.GetFamiliesByIdsAsync);

					return loader.LoadAsync(familyId);
				}
			);
		}
	}
}
