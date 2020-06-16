using System.Linq;
using Hedwig.Models;
using Hedwig.Data;
using System.Collections.Generic;
using System;

namespace Hedwig.Repositories
{
	public class C4KCertificateRepository : HedwigRepository, IC4KCertificateRepository
	{

		public C4KCertificateRepository(HedwigContext context) : base(context) { }

		public List<C4KCertificate> GetC4KCertificatesByChildId(Guid childId)
		{
			return _context.C4KCertificates
				.Where(c => c.ChildId == childId)
				.ToList();
		}

		public List<C4KCertificateDTO> GetC4KCertificateDTOsByChildId(Guid childId)
		{
			return _context.C4KCertificates
				.Where(c => c.ChildId == childId)
				.Select(c4kcDTO => new C4KCertificateDTO()
				{
					Id = c4kcDTO.Id,
					ChildId = c4kcDTO.ChildId,
					StartDate = c4kcDTO.StartDate,
					EndDate = c4kcDTO.EndDate,
					ValidationErrors = c4kcDTO.ValidationErrors
				})
				.ToList();
		}
	}

	public interface IC4KCertificateRepository : IHedwigRepository
	{
		List<C4KCertificate> GetC4KCertificatesByChildId(Guid childId);
		List<C4KCertificateDTO> GetC4KCertificateDTOsByChildId(Guid childId);
	}
}
