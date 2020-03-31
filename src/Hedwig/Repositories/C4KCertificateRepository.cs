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
	}

	public interface IC4KCertificateRepository : IHedwigRepository
	{
		List<C4KCertificate> GetC4KCertificatesByChildId(Guid childId);
	}
}
