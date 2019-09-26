using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Internal;

namespace Hedwig.Data
{
    public static class DbSetExtensions
    {
        public static DbContext GetDbContext<T>(this DbSet<T> dbSet) where T : class
        {
            var infrastructure = dbSet as IInfrastructure<IServiceProvider>;
            return (infrastructure.GetService<ICurrentDbContext>() as ICurrentDbContext).Context;

        }
        public static string GetTableName<T>(this DbSet<T> dbSet) where T : class
        {
            var entityType = dbSet.GetDbContext()
                .Model.GetEntityTypes()
                .FirstOrDefault(t => t.ClrType == typeof(T));

            if (entityType is null) {
                throw new ApplicationException($"Entity type {typeof(T).Name} not found in current db context");
            }
            return entityType.GetAnnotation("Relational:TableName").Value.ToString();
        }

        public static IQueryable<T> AsOf<T>(this DbSet<T> dbSet, DateTime asOf) where T : class
        {
            return dbSet
				.AsNoTracking()
				.FromSql($@"
                    SELECT * 
                    FROM {dbSet.GetTableName()}
                    FOR SYSTEM_TIME AS OF {{0}}",
              	    asOf
                );
        }
    }
}
