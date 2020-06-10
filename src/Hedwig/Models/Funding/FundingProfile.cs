using AutoMapper;
using Hedwig.Repositories;

namespace Hedwig.Models
{
	public class FundingProfile : Profile
	{
		public FundingProfile()
		{
			CreateMap<FundingDTO, Funding>()
				.ForMember(
					dest => dest.FirstReportingPeriod,
					opt => opt.MapFrom<FirstReportingPeriodResolver>()
				)
				.ForMember(
					dest => dest.LastReportingPeriod,
					opt => opt.MapFrom<LastReportingPeriodResolver>()
				)
				.ForMember(
					dest => dest.FundingSpace,
					opt => opt.MapFrom<FundingSpaceResolver>()
				)
				.ReverseMap();
		}
	}
}
