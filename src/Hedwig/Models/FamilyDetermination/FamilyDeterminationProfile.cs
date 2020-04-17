using AutoMapper;

namespace Hedwig.Models
{
	public class FamilyDeterminationProfile : Profile
	{
		public FamilyDeterminationProfile()
		{
			CreateMap<FamilyDetermination, FamilyDeterminationDTOForRoster>();
			CreateMap<FamilyDeterminationDTOForRoster, FamilyDetermination>();
		}
	}
}
