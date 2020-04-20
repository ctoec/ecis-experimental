using AutoMapper;
using System;

namespace Hedwig.Models
{
	public class ChildProfile : Profile
	{
		public ChildProfile()
		{
			CreateMap<Child, EnrollmentSummaryChildDTO>()
				.ReverseMap();

			CreateMap<Child, EnrollmentChildDTO>()
				.ForMember(
					child => child.Birthdate,
					opt => opt.MapFrom(child => child.Birthdate.HasValue ? child.Birthdate.Value.Date : null as DateTime?)
				)
				.ReverseMap();
		}
	}
}
