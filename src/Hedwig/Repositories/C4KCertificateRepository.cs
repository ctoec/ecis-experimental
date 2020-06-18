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
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return _context.C4KCertificates
				.Where(c => c.ChildId == childId)
				.Select(c4kc => new C4KCertificateDTO()
				{
					Id = c4kc.Id,
					ChildId = c4kc.ChildId,
					StartDate = c4kc.StartDate,
					EndDate = c4kc.EndDate,
					ValidationErrors = c4kc.ValidationErrors
				})
				.ToList();
		}

		public List<C4KCertificateDTO> GetC4KCertificateDTOsByChildIds(IEnumerable<Guid> childIds)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return _context.C4KCertificates
				.Where(c => childIds.Contains(c.ChildId))
				.Select(c4kc => new C4KCertificateDTO()
				{
					Id = c4kc.Id,
					ChildId = c4kc.ChildId,
					StartDate = c4kc.StartDate,
					EndDate = c4kc.EndDate,
					ValidationErrors = c4kc.ValidationErrors
				})
				.ToList();
		}

	}

	public interface IC4KCertificateRepository : IHedwigRepository
	{
		List<C4KCertificate> GetC4KCertificatesByChildId(Guid childId);
		List<C4KCertificateDTO> GetC4KCertificateDTOsByChildId(Guid childId);
		List<C4KCertificateDTO> GetC4KCertificateDTOsByChildIds(IEnumerable<Guid> childIds);
	}
}
