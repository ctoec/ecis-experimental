using AutoMapper;

namespace Hedwig.Models
{
	public class SiteProfile : Profile
	{
		public SiteProfile()
		{
			CreateMap<Site, SiteDTOForRoster>();
			CreateMap<SiteDTOForRoster, Site>();
		}
	}
}
