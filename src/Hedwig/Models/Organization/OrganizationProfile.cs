using AutoMapper;

namespace Hedwig.Models
{
	public class OrganizationProfile : Profile
	{
		public OrganizationProfile()
		{
			CreateMap<Organization, OrganizationSummaryDTO>()
				.ReverseMap();

			CreateMap<Organization, OrganizationDTO>()
				.ReverseMap();
		}
	}
}
