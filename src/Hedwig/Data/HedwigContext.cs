using Hedwig.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

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

      // Set all fks onDelete to restrict to enable complex fk relationships
      modelBuilder.SetAllFKsOnDelete(DeleteBehavior.Restrict);
    }

    /// <summary>
    /// Overrides the base `DbContext.Add()` functionality to add an author name to the AuthoredBy
    /// field on temporal entities.
    /// NOTE: This means we need to use the `context.Add<T>()` approach to create db models,
    /// as opposed to `context.[TypeDbSet].Add()` approach.
    /// </summary>
    /// <param name="entity"></param>
    /// <typeparam name="TEntity"></typeparam>
    /// <returns></returns>
    public override EntityEntry<TEntity> Add<TEntity>(TEntity entity)
    {
      if (IsTemporalEntityType<TEntity>())
      {
        int? currentUserId = GetCurrentUserId();
        AddAuthorToTemporalEntity(entity as TemporalEntity, currentUserId);
      }

      return base.Add<TEntity>(entity);
    }


    /// <summary>
    /// Overrides the base `DbContext.Update()` functionality to add an author name to the AuthoredBy
    /// field on temporal entities.
    /// NOTE: This means we need to use the `context.Update<T>()` approach to update db models,
    /// as opposed to `context.true[TypeDbSet].Update()` approach.
    /// </summary>
    /// <param name="entity"></param>
    /// <typeparam name="TEntity"></typeparam>
    /// <returns></returns>
    public override EntityEntry<TEntity> Update<TEntity>(TEntity entity)
    {
      if (IsTemporalEntityType<TEntity>())
      {
        int? currentUserId = GetCurrentUserId();
        AddAuthorToTemporalEntity(entity as TemporalEntity, currentUserId);
      }
      return base.Update<TEntity>(entity);
    }

    /// <summary>
    /// Determines if a given entity type is a TemporalEntity
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <returns>True if type T is subclass of TemporalEntity, else false.</returns>
    private bool IsTemporalEntityType<T>()
    {
      return typeof(TemporalEntity).IsAssignableFrom(typeof(T));
    }

    /// <summary>
    /// Recursively adds author UserId to AuthorId field on temporal entities
    /// </summary>
    /// <param name="entity"></param>s
    protected void AddAuthorToTemporalEntity(TemporalEntity entity, int? currentUserId)
    {
      entity.AuthorId = currentUserId;
      
      // Recursively add AuthorId to any TemporalEntity sub-props
      var props = entity.GetType().GetProperties();
      foreach (var prop in props)
      {
        var subProp = prop.GetValue(entity);
        if (typeof(TemporalEntity).IsAssignableFrom(prop.PropertyType)
          && subProp != null)
        {
          AddAuthorToTemporalEntity(subProp as TemporalEntity, currentUserId);
        }
      }
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
