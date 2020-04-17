using AutoMapper;

namespace Hedwig.Models
{
	public class OrganizationProfile : Profile
	{
		public OrganizationProfile()
		{
			CreateMap<Organization, OrganizationDTOForRoster>();
			CreateMap<OrganizationDTOForRoster, Organization>();
		}
	}
}
