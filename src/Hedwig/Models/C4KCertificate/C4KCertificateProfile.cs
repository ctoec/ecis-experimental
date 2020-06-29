using System;
using AutoMapper;

namespace Hedwig.Models
{
	public class C4KCertificateProfile : Profile
	{
		public C4KCertificateProfile()
		{
			CreateMap<C4KCertificate, C4KCertificateDTO>()
				.ForMember(
						cert => cert.StartDate,
						opt => opt.MapFrom(cert => cert.StartDate.HasValue ? cert.StartDate.Value.Date : null as DateTime?)
					)
					.ForMember(
						cert => cert.EndDate,
						opt => opt.MapFrom(cert => cert.EndDate.HasValue ? cert.EndDate.Value.Date : null as DateTime?)
					)
				.ReverseMap();
		}
	}
}
