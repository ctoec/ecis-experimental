using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Security;
using GraphQL.Types;
using GraphQL.Authorization;

namespace Hedwig.Schema.Types
{
	public class UserType : HedwigGraphType<User>, IAuthorizedGraphType
	{
		public UserType(ISiteRepository sites, IReportRepository reports)
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
			Field<NonNullGraphType<ListGraphType<NonNullGraphType<ReportType>>>>(
				"reports",
				resolve: context => reports.GetReportsByUserIdAsync(context.Source.Id)
			);
		}

		public AuthorizationRules Permissions(AuthorizationRules rules)
		{
			rules.DenyNot("IsAuthenticatedUserPolicy");
			rules.Allow("IsCurrentUserPolicy");
			rules.Allow("IsDeveloperInDevPolicy");
			rules.Allow("IsTestModePolicy");
			rules.Deny();
			return rules;
		}
	}
}
