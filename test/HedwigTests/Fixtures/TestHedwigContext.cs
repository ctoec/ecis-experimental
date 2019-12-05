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
        public TestHedwigContext(DbContextOptions<HedwigContext> options, IHttpContextAccessor httpContextAccessor)
            : base(options, httpContextAccessor)
        {
            Created = new List<EntityEntry>();
        }
    }
}