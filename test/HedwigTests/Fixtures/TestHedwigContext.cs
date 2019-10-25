using Hedwig.Data;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.AspNetCore.Http;


namespace HedwigTests.Fixtures
{
    public class TestHedwigContext : HedwigContext
    {
        List<EntityEntry> Created { get; set; }
        bool ShouldRetainObjects { get; set; }
        public TestHedwigContext(DbContextOptions<HedwigContext> options, IHttpContextAccessor httpContextAccessor, bool retainObjects = false)
            : base(options, httpContextAccessor)
        {
            Created = new List<EntityEntry>();
            ShouldRetainObjects = retainObjects;
        }

        public override int SaveChanges()   
        {
            if(!ShouldRetainObjects || !TestEnvironmentFlags.ShouldRetainObjects()) {
                var newCreated = ChangeTracker.Entries()
                    .Where(e => e.State == EntityState.Added);
                Created.AddRange(newCreated);
            }
            return base.SaveChanges();
        }

        public override void Dispose()
        {
            if (!ShouldRetainObjects || !TestEnvironmentFlags.ShouldRetainObjects()) {
                foreach (EntityEntry e in Created) { 
                    Remove(e.Entity);
                }
                base.SaveChanges();
            }
            base.Dispose();
        }
    }
}