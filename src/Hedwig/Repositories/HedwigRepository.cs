using Hedwig.Data;

namespace Hedwig.Repositories
{
    public abstract class HedwigRepository
    {
        protected readonly HedwigContext _context;

        public HedwigRepository(HedwigContext context) => _context = context;
    }
}