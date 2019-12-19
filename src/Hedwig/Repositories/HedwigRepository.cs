using Hedwig.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;

namespace Hedwig.Repositories
{
	public abstract class HedwigRepository
	{
		protected const string INCLUDE_FAMILY = "family";
		protected const string INCLUDE_DETERMINATIONS = "determinations";
		protected const string INCLUDE_CHILD = "child";
		protected const string INCLUDE_FUNDINGS = "fundings";
		protected const string INCLUDE_ENROLLMENTS = "enrollments";
		protected const string INCLUDE_SITES = "sites";
		protected const string INCLUDE_ORGANIZATIONS = "organizations";
		protected const string INCLUDE_FUNDING_SPACES = "funding_spaces";

		protected readonly HedwigContext _context;

		public HedwigRepository(HedwigContext context) => _context = context;

		public Task SaveChangesAsync()
		{
			return _context.SaveChangesAsync();
		}
	}

	public interface IHedwigRepository
	{
		Task SaveChangesAsync();
	}
}
