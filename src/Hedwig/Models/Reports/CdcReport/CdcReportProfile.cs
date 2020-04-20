using AutoMapper;

namespace Hedwig.Models
{
	public class CdcReportProfile : Profile
	{
		public CdcReportProfile()
		{
			CreateMap<CdcReport, OrganizationReportSummaryDTO>()
				.ReverseMap();
		}
	}
}
