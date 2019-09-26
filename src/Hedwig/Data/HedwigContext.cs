using Hedwig.Models;
using Microsoft.EntityFrameworkCore;
using System;

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
		public DbSet<Site> Sites { get; set; }
		public DbSet<SitePermission> SitePermissions { get; set; }
		public DbSet<User> Users { get; set; }

		public DbSet<T> GetDbSetForType<T>() where T : class
		{
			if(typeof(T) == typeof(Child)) {
				return (DbSet<T>)(object)Children;
			}

			if(typeof(T) == typeof(Enrollment)) {
				return (DbSet<T>)(object)Enrollments;
			}

			if(typeof(T) == typeof(Family)) {
				return (DbSet<T>)(object)Families;
			}

			if(typeof(T) == typeof(FamilyDetermination)) {
				return (DbSet<T>)(object)FamilyDeterminations;
			}

			if(typeof(T) == typeof(Funding)) {
				return (DbSet<T>)(object)Fundings;
			}

			if(typeof(T) == typeof(Site)) {
				return (DbSet<T>)(object)Sites;
			}

			if(typeof(T) == typeof(SitePermission)) {
				return (DbSet<T>)(object)SitePermissions;
			}
		
			if(typeof(T) == typeof(User)) {
				return (DbSet<T>)(object)Users;
			}

			throw new Exception($"HedwigContext does not have DbSet<T> for T = {typeof(T).Name}");
		}
		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Child>().ToTable("Child");
			modelBuilder.Entity<Enrollment>().ToTable("Enrollment");
			modelBuilder.Entity<Family>().ToTable("Family");
			modelBuilder.Entity<FamilyDetermination>().ToTable("FamilyDetermination");
			modelBuilder.Entity<Funding>().ToTable("Funding");
			modelBuilder.Entity<Site>().ToTable("Site");
			modelBuilder.Entity<SitePermission>().ToTable("SitePermission");
			modelBuilder.Entity<User>().ToTable("User");
		}
	}
}
