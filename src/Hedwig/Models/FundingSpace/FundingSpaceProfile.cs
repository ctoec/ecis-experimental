using AutoMapper;

namespace Hedwig.Models
{
	public class FundingSpaceProfile : Profile
	{
		public FundingSpaceProfile()
		{
			CreateMap<FundingSpace, FundingSpaceDTOForRoster>();
			CreateMap<FundingSpaceDTOForRoster, FundingSpace>();
		}
	}
}
