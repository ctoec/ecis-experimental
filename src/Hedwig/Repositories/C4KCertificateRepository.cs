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
				.SelectC4KCertificateDTO()
				.ToList();
		}

		public List<C4KCertificateDTO> GetC4KCertificateDTOsByChildIds(IEnumerable<Guid> childIds)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return _context.C4KCertificates
				.Where(c => childIds.Contains(c.ChildId))
				.SelectC4KCertificateDTO()
				.ToList();
		}

	}

	public static class C4KCertificateQueryExtensions
	{
		public static IQueryable<C4KCertificateDTO> SelectC4KCertificateDTO(this IQueryable<C4KCertificate> query)
		{
			return query.Select(c4kc => new C4KCertificateDTO()
			{
				Id = c4kc.Id,
				ChildId = c4kc.ChildId,
				StartDate = c4kc.StartDate,
				EndDate = c4kc.EndDate,
				ValidationErrors = c4kc.ValidationErrors
			});
		}
	}

	public interface IC4KCertificateRepository : IHedwigRepository
	{
		List<C4KCertificate> GetC4KCertificatesByChildId(Guid childId);
		List<C4KCertificateDTO> GetC4KCertificateDTOsByChildId(Guid childId);
		List<C4KCertificateDTO> GetC4KCertificateDTOsByChildIds(IEnumerable<Guid> childIds);
	}
}
