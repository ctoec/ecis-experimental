using System.Linq;
using System;
using Hedwig.Data;

namespace Hedwig.Repositories
{
    public abstract class TemporalRepository : HedwigRepository
    {
        public TemporalRepository(HedwigContext context) : base(context) {}

        /// <summary>
        /// Returns an IQueryable for the given entity type T, either with or without temporal
        /// filtering applied, dependent on value of `asOf`
        /// </summary>
        /// <type name="asOf">The nullable timestamp to optionally apply as temporal filter</param>
        /// <typeparam name="T"></typeparam>
        protected IQueryable<T> GetBaseQuery<T>(DateTime? asOf = null) where T : class
        {
            if (asOf.HasValue) {
                return _context.Set<T>().AsOf(asOf.Value);
            }

            return _context.Set<T>();
        }
    }
}