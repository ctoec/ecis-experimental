using AutoMapper;

namespace Hedwig.Models
{
	public class FundingTimeSplitUtilizationProfile : Profile
	{
		public FundingTimeSplitUtilizationProfile()
		{
			CreateMap<FundingTimeSplitUtilization, FundingTimeSplitUtilizationDTO>()
				.ReverseMap();
		}
	}
}
