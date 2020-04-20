using AutoMapper;

namespace Hedwig.Models
{
	public class FamilyDeterminationProfile : Profile
	{
		public FamilyDeterminationProfile()
		{
			CreateMap<FamilyDetermination, EnrollmentFamilyDeterminationDTO>()
				.ReverseMap();
		}
	}
}
