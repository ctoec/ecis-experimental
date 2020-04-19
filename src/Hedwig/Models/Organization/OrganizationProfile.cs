using AutoMapper;

namespace Hedwig.Models
{
	public class OrganizationProfile : Profile
	{
		public OrganizationProfile()
		{
			CreateMap<Organization, EnrollmentSummaryOrganizationDTO>();
			CreateMap<EnrollmentSummaryOrganizationDTO, Organization>();
		}
	}
}
