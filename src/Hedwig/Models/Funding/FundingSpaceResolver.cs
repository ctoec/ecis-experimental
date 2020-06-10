using Hedwig.Repositories;
using AutoMapper;

namespace Hedwig.Models
{
	public class FundingSpaceResolver : IValueResolver<FundingDTO, Funding, FundingSpace>
	{
		private readonly IMapper _mapper;
		private readonly IFundingSpaceRepository _fundingSpaces;

		public FundingSpaceResolver(
			IMapper mapper,
			IFundingSpaceRepository fundingSpaces
		)
		{
			_mapper = mapper;
			_fundingSpaces = fundingSpaces;
		}

		public FundingSpace Resolve(FundingDTO fundingDTO, Funding funding, FundingSpace fundingSpace, ResolutionContext context)
		{
			if(fundingDTO.FundingSpaceId.HasValue) {
				return fundingDTO.FundingSpace != null
					? _mapper.Map<FundingSpaceDTO, FundingSpace>(fundingDTO.FundingSpace)
					: _fundingSpaces.GetById(fundingDTO.FundingSpaceId.Value);
			}
			
			return null;
		}
	}
}
