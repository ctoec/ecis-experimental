using AutoMapper;

namespace Hedwig.Models
{
	public class EnrollmentProfile : Profile
	{
		public EnrollmentProfile()
		{
			CreateMap<Enrollment, EnrollmentSummaryDTO>();
			CreateMap<EnrollmentSummaryDTO, Enrollment>();
		}
	}
}
