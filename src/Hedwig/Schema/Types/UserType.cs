using Hedwig.Models;
using Hedwig.Repositories;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
	public class UserType : HedwigGraphType<User>
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
	}
}
