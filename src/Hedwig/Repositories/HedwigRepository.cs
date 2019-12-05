using Hedwig.Data;
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
		}
		protected readonly HedwigContext _context;

		public HedwigRepository(HedwigContext context) => _context = context;

		protected void AddOrUpdateChildObject<T>(T entity)
		{
				var id = typeof(T).GetProperty("Id").GetValue(entity);

				if(id is Guid guid)
				{
						if(guid == Guid.Empty) {
								_context.Add(entity);
						} else {
								_context.Entry(entity).State = EntityState.Modified;
						}
				}
				else if(id is int iid)
				{
						if (iid == 0) {
								_context.Add(entity);
						} else {
								_context.Entry(entity).State = EntityState.Modified;
						}
				}
		}
}
}
