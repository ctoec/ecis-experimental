using AutoMapper;

namespace Hedwig.Models
{
	public class CdcReportProfile : Profile
	{
		public CdcReportProfile()
		{
			CreateMap<CdcReport, CdcReportDTO>()
				.ReverseMap();
				
			CreateMap<CdcReport, OrganizationReportSummaryDTO>()
				.ReverseMap();
		}
	}
}
