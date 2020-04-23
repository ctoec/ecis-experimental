using AutoMapper;

namespace Hedwig.Models
{
	public class FundingProfile : Profile
	{
		public FundingProfile()
		{
			CreateMap<Funding, FundingDTO>()
				.ReverseMap();
		}
	}
}
