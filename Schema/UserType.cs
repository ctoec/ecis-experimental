using ecis2.Models;
using ecis2.Repositories;
using GraphQL.Types;

namespace ecis2.Schema
{
	public class UserType : ObjectGraphType<User>
	{
		public UserType(ISiteRepository sites)
		{
			Field(u => u.Id);
			Field(u => u.FirstName);
			Field(u => u.MiddleName, nullable: true);
			Field(u => u.LastName);
			Field(u => u.Suffix, nullable: true);
			Field<NonNullGraphType<ListGraphType<NonNullGraphType<SiteType>>>>(
				"sites",
				resolve: context => sites.GetSitesByUserIdAsync(context.Source.Id)
			);
		}
	}
}
