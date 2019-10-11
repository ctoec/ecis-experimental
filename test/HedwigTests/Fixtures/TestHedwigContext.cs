using Hedwig.Data;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;


namespace HedwigTests.Fixtures
{
    public class TestHedwigContext : HedwigContext
    {
        List<EntityEntry> Created { get; set; }
        public TestHedwigContext(DbContextOptions<HedwigContext> options) : base(options)
        {
            Created = new List<EntityEntry>();
        }

        public override int SaveChanges()   
        {
            if(TestEnvironmentFlags.ShouldCleanupObjects()) {
                var newCreated = ChangeTracker.Entries()
                    .Where(e => e.State == EntityState.Added);
                Created.AddRange(newCreated);
            }
            return base.SaveChanges();
        }

        public override void Dispose()
        {
            if (TestEnvironmentFlags.ShouldCleanupObjects()) {
                foreach (EntityEntry e in Created) { 
                    Remove(e.Entity);
                }
                base.SaveChanges();
            }
            
            base.Dispose();
        }
    }
}