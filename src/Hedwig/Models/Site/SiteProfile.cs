using AutoMapper;

namespace Hedwig.Models
{
	public class SiteProfile : Profile
	{
		public SiteProfile()
		{
			CreateMap<Site, EnrollmentSummarySiteDTO>();
			CreateMap<EnrollmentSummarySiteDTO, Site>();
			CreateMap<Site, OrganizationSiteDTO>();
			CreateMap<OrganizationSiteDTO, Site>();
		}
	}
}
