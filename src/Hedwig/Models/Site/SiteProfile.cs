using AutoMapper;

namespace Hedwig.Models
{
	public class SiteProfile : Profile
	{
		public SiteProfile()
		{
			CreateMap<Site, SiteDTO >()
				.ReverseMap();
		}
	}
}
