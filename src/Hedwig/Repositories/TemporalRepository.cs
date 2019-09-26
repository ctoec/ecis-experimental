using System.Linq;
using System;
using Hedwig.Data;

namespace Hedwig.Repositories
{
    public abstract class TemporalRepository : HedwigRepository
    {
        public TemporalRepository(HedwigContext context) : base(context) {}
        protected IQueryable<T> GetBaseQuery<T>(DateTime? asOf) where T : class
        {
            if (asOf.HasValue) {
                return _context.GetDbSetForType<T>().AsOf(asOf.Value);
            }

            return _context.GetDbSetForType<T>();
        }
    }
}