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

		public FundingSpace Resolve(FundingDTO source, Funding destination, FundingSpace destMember, ResolutionContext context)
		{
			if (source.FundingSpaceId.HasValue)
			{
				return source.FundingSpace != null
					? _mapper.Map<FundingSpaceDTO, FundingSpace>(source.FundingSpace)
					: _fundingSpaces.GetById(source.FundingSpaceId.Value);
			}

			return null;
		}
	}
}
