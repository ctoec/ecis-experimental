using Hedwig.Models;
using Microsoft.EntityFrameworkCore;

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
			modelBuilder.Entity<Permission>().ToTable("Permissions")
				.HasDiscriminator<string>("Type")
				.HasValue<OrganizationPermission>("Organization")
				.HasValue<SitePermission>("Site");
			modelBuilder.Entity<Site>().ToTable("Site");
			modelBuilder.Entity<User>().ToTable("User");
		}
	}
}
