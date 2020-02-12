using Hedwig.Models;
using Hedwig.Models.Attributes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Hedwig.Data
{
  public class HedwigContext : DbContext
  {
    private readonly IHttpContextAccessor _httpContextAccessor;
    public HedwigContext(DbContextOptions<HedwigContext> options, IHttpContextAccessor httpContextAccessor) : base(options)
    {
      _httpContextAccessor = httpContextAccessor;
    }

    public DbSet<Child> Children { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<Family> Families { get; set; }
    public DbSet<FamilyDetermination> FamilyDeterminations { get; set; }
    public DbSet<Funding> Fundings { get; set; }
    public DbSet<FundingSpace> FundingSpaces { get; set; }
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<Report> Reports { get; set; }
    public DbSet<ReportingPeriod> ReportingPeriods { get; set; }
    public DbSet<Site> Sites { get; set; }
    public DbSet<SitePermission> SitePermissions { get; set; }
    public DbSet<User> Users { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Child>().ToTable("Child");
      modelBuilder.Entity<Enrollment>().ToTable("Enrollment");
      modelBuilder.Entity<Family>().ToTable("Family");
      modelBuilder.Entity<FamilyDetermination>().ToTable("FamilyDetermination");
      modelBuilder.Entity<Funding>().ToTable("Funding");
      modelBuilder.Entity<FundingSpace>().ToTable("FundingSpace");
      modelBuilder.Entity<Organization>().ToTable("Organization");
      modelBuilder.Entity<Permission>().ToTable("Permission")
        .HasDiscriminator<string>("Type")
        .HasValue<OrganizationPermission>("Organization")
        .HasValue<SitePermission>("Site");
      modelBuilder.Entity<Report>().ToTable("Report")
        .HasDiscriminator<FundingSource>("Type")
        .HasValue<CdcReport>(FundingSource.CDC);
      modelBuilder.Entity<ReportingPeriod>().ToTable("ReportingPeriod");
      modelBuilder.Entity<Site>().ToTable("Site");
      modelBuilder.Entity<User>().ToTable("User");

      // Set all default fks onDelete to restrict to enable complex fk relationships
      modelBuilder.SetAllFKsOnDelete(DeleteBehavior.Restrict);

      // Override specific foreign key relationships
      modelBuilder.Entity<Funding>()
        .HasOne(f => f.Enrollment)
        .WithMany(e => e.Fundings)
        .HasForeignKey(f => f.EnrollmentId)
        .IsRequired()
        .OnDelete(DeleteBehavior.Cascade);
    }

    /// <summary>
    /// Override `SaveChangesAsync()` to first protect read-only entities (optional for testing)
    /// </summary>
    /// <param name="ignoreReadOnly"></param>
    /// <returns></returns>
    public Task<int> SaveChangesAsync(bool ignoreReadOnly = false)
    {
      if(!ignoreReadOnly)
      {
        ProtectReadOnlyEntities();
      }
      UpdateTemporalEntities();
      return base.SaveChangesAsync();
    }

    /// <summary>
    /// Override `SaveChanges()` to first protect read-only entities (optional for testing)
    /// </summary>
    /// <param name="ignoreReadOnly"></param>
    /// <returns></returns>
    public new int SaveChanges(bool ignoreReadOnly = false)
    {
			if(!ignoreReadOnly)
      {
	      ProtectReadOnlyEntities();
			}

      UpdateTemporalEntities();
      return base.SaveChanges();
    }

    private void UpdateTemporalEntities()
    {
      var newOrUpdatedEntities = ChangeTracker.Entries()
        .Where(e => 
          e.Entity is TemporalEntity &&
          (e.State == EntityState.Added || e.State == EntityState.Modified)
        );

      int? currentUserId = GetCurrentUserId();
      DateTime now = DateTime.UtcNow;
      foreach(var entity in newOrUpdatedEntities)
      {
        UpdateTemporalEntity(entity.Entity as TemporalEntity, currentUserId, now);
      }
    }

    /// <summary>
    /// Ensures no read-only entities are updated by explicitly overwriting the state
    /// of any read-only entities the change tracker knows to be modified.
    /// </summary>
    private void ProtectReadOnlyEntities()
    {
      var newOrUpdatedEntities = ChangeTracker.Entries()
        .Where(e => 
          ReadOnlyAttribute.IsReadOnly(e.Entity) && 
          (e.State == EntityState.Added || e.State == EntityState.Modified)
        );

      foreach (var entity in newOrUpdatedEntities)
      {
        entity.State = entity.State == EntityState.Added ? EntityState.Detached : EntityState.Unchanged;
      }
    }

    /// <summary>
    /// Adds AuthorId and UpdatedAt to an Added or Modified TemporalEntity
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="currentUserId"></param>
    /// <param name="now"></param>
    private void UpdateTemporalEntity(TemporalEntity entity, int? currentUserId, DateTime now)
    {
      entity.AuthorId = currentUserId;
      entity.UpdatedAt = now;
    }

    /// <summary>
    /// Gets the current UserId from HttpContext.User,
    /// or null if no UserId could be retrieved
    /// </summary>
    /// <returns></returns>
    protected virtual int? GetCurrentUserId()
    {
      if (_httpContextAccessor == null
        || _httpContextAccessor.HttpContext == null
        || _httpContextAccessor.HttpContext.User == null)
      {
        return null;
      }

      var subClaim = _httpContextAccessor.HttpContext.User.FindFirst("sub")?.Value;
      if (subClaim == null) 
      { 
        return null; 
      }

      Guid wingedKeysId;
      var isGuid = Guid.TryParse(subClaim, out wingedKeysId);
      if (!isGuid) 
      { 
        return null;
      }

      return Users
        .Where(user => user.WingedKeysId == wingedKeysId)
        .Select(user => user.Id)
        .Cast<int?>()
        .FirstOrDefault();
    }
  }
}
