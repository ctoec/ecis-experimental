using GraphQL.Types;
using Hedwig.Security;

namespace Hedwig.Schema.Types
{
	public class ReportType : UnionGraphType, IAuthorizedGraphType
	{
		public ReportType()
		{
			Type<CdcReportType>();
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
