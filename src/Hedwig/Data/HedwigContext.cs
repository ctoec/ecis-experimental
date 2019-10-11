using Hedwig.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Hedwig.Data
{
	public class HedwigContext : DbContext
	{
		public HedwigContext(DbContextOptions<HedwigContext> options) : base(options)
		{ }

		public DbSet<Child> Children { get; set; }
		public DbSet<Enrollment> Enrollments { get; set; }
		public DbSet<Family> Families { get; set; }
		public DbSet<FamilyDetermination> FamilyDeterminations { get; set; }
		public DbSet<Funding> Fundings { get; set; }
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
		public override EntityEntry<TEntity> Add<TEntity> (TEntity entity)
		{
			if(IsTemporalEntityType<TEntity>()) {
				AddAuthorToTemporalEntity(entity as TemporalEntity);
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
		public override EntityEntry<TEntity> Update<TEntity> (TEntity entity)
		{
			if(IsTemporalEntityType<TEntity>()){
				AddAuthorToTemporalEntity(entity as TemporalEntity);
			}
			return base.Update<TEntity>(entity);
		}

		/// <summary>
		/// Helper method to determine if a given entity type is a TemporalEntity
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <returns>True if type T is subclass of TemporalEntity, else false.</returns>
		private bool IsTemporalEntityType<T>()
		{
			return typeof(TemporalEntity).IsAssignableFrom(typeof(T));
		}

		/// <summary>
		/// Helper method to add author name to AuthoredBy field on temporal entity. Right now, 
		/// author name is a place holder; in the future it will pull from session information.
		/// </summary>
		/// <param name="entity"></param>
		protected virtual void AddAuthorToTemporalEntity(TemporalEntity entity)
		{
			entity.AuthoredBy = "authorName"; // from session, injected via IHttpContextAccessor?
		}
	}
}
