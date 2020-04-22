using AutoMapper;
using System;

namespace Hedwig.Models
{
	public class FamilyDeterminationProfile : Profile
	{
		public FamilyDeterminationProfile()
		{
			CreateMap<FamilyDetermination, EnrollmentFamilyDeterminationDTO>()
				.ForMember(
					det => det.DeterminationDate,
					opt => opt.MapFrom(det => det.DeterminationDate.HasValue ? det.DeterminationDate.Value.Date : null as DateTime?)
				)
				.ReverseMap();
		}
	}
}
