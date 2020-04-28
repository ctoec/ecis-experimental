using AutoMapper;
using System;

namespace Hedwig.Models
{
	public class C4KCertificateProfile : Profile
	{
		public C4KCertificateProfile()
		{
			CreateMap<C4KCertificate, C4KCertificateDTO>()
				.ReverseMap();
		}
	}
}
