using AutoMapper;

namespace Hedwig.Models
{
	public class FamilyProfile : Profile
	{
		public FamilyProfile()
		{
			CreateMap<Family, FamilyDTOForRoster>();
			CreateMap<FamilyDTOForRoster, Family>();
		}
	}
}
