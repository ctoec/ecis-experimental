using System;
using AutoMapper;

namespace Hedwig.Models
{
	public class EnrollmentProfile : Profile
	{
		public EnrollmentProfile()
		{
			CreateMap<Enrollment, EnrollmentSummaryDTO>()
				.ReverseMap();

			CreateMap<Enrollment, EnrollmentDTO>()
				.ForMember(
					enrollment => enrollment.Entry,
					opt => opt.MapFrom(enrollment => enrollment.Entry.HasValue ? enrollment.Entry.Value.Date : null as DateTime?)
				)
				.ForMember(
					enrollment => enrollment.Exit,
					opt => opt.MapFrom(enrollment => enrollment.Exit.HasValue ? enrollment.Exit.Value.Date : null as DateTime?)
				)
				.ReverseMap();

			CreateMap<Enrollment, CdcReportEnrollmentDTO>()
				.ReverseMap();
		}
	}
}
