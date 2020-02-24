using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Hedwig.Data
{
  public static class DbSetExtensions
  {
	/// <summary>
	/// Retrieves the DbContext for an given dbSet
	/// </summary>
	/// <typeparam name="T"></typeparam>
	private static DbContext GetDbContext<T>(this DbSet<T> dbSet) where T : class
	{
	  var infrastructure = dbSet as IInfrastructure<IServiceProvider>;
	  return (infrastructure.GetService<ICurrentDbContext>() as ICurrentDbContext).Context;

	}

	/// <summary>
	/// Retrieves the table name associated with entity type of dbSet
	/// </summary>
	/// <typeparam name="T"></typeparam>
	private static string GetTableName<T>(this DbSet<T> dbSet) where T : class
	{
	  var entityType = dbSet.GetDbContext()
		  .Model.GetEntityTypes()
		  .FirstOrDefault(t => t.ClrType == typeof(T));

	  if (entityType is null)
	  {
		throw new ApplicationException($"Entity type {typeof(T).Name} not found in current db context");
	  }
	  return entityType.GetAnnotation("Relational:TableName").Value.ToString();
	}

	/// <summary>
	/// Filters a temporal dataset based on a timestamp by adding `FOR SYSTEM_TIME AS OF {asOf}` to the query.
	/// Returns an IQueryable to enable chaining of `.AsOf()` calls in Linq-style querying.
	/// Does not check that dbSet supports temporal querying; will result in SQL errors if used to filter a
	/// dataset without temporal support.
	/// </summary>
	/// <typeparam name="T"></typeparam>
	public static IQueryable<T> AsOf<T>(this DbSet<T> dbSet, DateTime asOf) where T : class
	{
	  return dbSet
		  .FromSqlRaw<T>($@"
                    SELECT * 
                    FROM {dbSet.GetTableName()}
                    FOR SYSTEM_TIME AS OF {{0}}",
				asOf
		  )
		  .AsNoTracking();
	}
  }
}
