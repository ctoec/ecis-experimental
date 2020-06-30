using AutoMapper;

namespace Hedwig.Models
{
	public class OrganizationProfile : Profile
	{
		public OrganizationProfile()
		{
			CreateMap<Organization, EnrollmentSummaryOrganizationDTO>()
				.ReverseMap();

			CreateMap<Organization, OrganizationReportSummaryOrganizationDTO>()
				.ReverseMap();

			CreateMap<Organization, CdcReportOrganizationDTO>()
				.ReverseMap();
		}
	}
}
