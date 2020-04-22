using AutoMapper;

namespace Hedwig.Models
{
	public class ChildProfile : Profile
	{
		public ChildProfile()
		{
			CreateMap<Child, ChildDTOForRoster>()
				.ReverseMap();

			CreateMap<Child, EnrollmentChildDTO>()
				.ReverseMap();
		}
	}
}
