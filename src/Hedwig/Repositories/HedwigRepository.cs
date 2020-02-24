using Hedwig.Data;
using Hedwig.Models;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace Hedwig.Repositories
{
  public abstract class HedwigRepository
  {
	public const string INCLUDE_FAMILY = "family";
	public const string INCLUDE_DETERMINATIONS = "determinations";
	public const string INCLUDE_CHILD = "child";
	public const string INCLUDE_FUNDINGS = "fundings";
	public const string INCLUDE_ENROLLMENTS = "enrollments";
	public const string INCLUDE_SITES = "sites";
	public const string INCLUDE_ORGANIZATIONS = "organizations";
	public const string INCLUDE_FUNDING_SPACES = "funding_spaces";

	protected readonly HedwigContext _context;

	public HedwigRepository(HedwigContext context) => _context = context;

	public Task SaveChangesAsync()
	{
	  return _context.SaveChangesAsync();
	}

	/// <summary>
	/// Deletes removed items from enumerable child object array on object update.
	/// Adding and updating in the array happens for free with Entity Framework
	/// </summary>
	/// <param name="updates"></param>
	/// <param name="currents"></param>
	/// <typeparam name="T"></typeparam>
	public void UpdateEnumerableChildObjects<T>(IEnumerable<IHedwigIdEntity<T>> updates, IEnumerable<IHedwigIdEntity<T>> currents)
	{
	  if (updates == null)
	  {
		return;
	  }

	  foreach (var current in currents)
	  {
		if (!updates.Any(u => u.Id.Equals(current.Id)))
		{
		  _context.Remove(current);
		}
	  }
	}
  }

  public interface IHedwigRepository
  {
	Task SaveChangesAsync();
  }
}
