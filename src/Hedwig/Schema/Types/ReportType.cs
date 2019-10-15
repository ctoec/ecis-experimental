using GraphQL.Types;

namespace Hedwig.Schema.Types
{
	public class ReportType : UnionGraphType
	{
		public ReportType()
		{
			Type<CdcReportType>();
		}
	}
}
