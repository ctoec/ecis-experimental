using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;
using Hedwig.Controllers;

namespace Hedwig.Repositories
{
	public class ChildRepository : TemporalRepository, IChildRepository
	{
		public ChildRepository(HedwigContext context) : base(context) {}

		public Task<List<Child>> GetChildrenForOrganizationAsync(int organizationId, string[] include = null)
		{
			var children = _context.Children
				.Where(c => c.OrganizationId.HasValue
					&& c.OrganizationId.Value == organizationId);


			include = include ?? new string[]{};
			if (include.Contains(INCLUDE_FAMILY))
			{
				children = children.Include(c => c.Family);

				if(include.Contains(INCLUDE_DETERMINATIONS))
				{
					children = ((IIncludableQueryable<Child, Family>)children).ThenInclude(f => f.Determinations);
				}
			}

			return children.ToListAsync();
		}

		public Task<Child> GetChildForOrganizationAsync(Guid id, int organizationId, string[] include = null)
		{
			var child = _context.Children
				.Where(c => c.Id == id
					&& (
						c.OrganizationId.HasValue
						&& c.OrganizationId.Value == organizationId
					)
				);
			include = include ?? new string[]{};
			if (include.Contains(INCLUDE_FAMILY))
			{
				child = child.Include(c => c.Family);

				if(include.Contains(INCLUDE_DETERMINATIONS))
				{
					child = ((IIncludableQueryable<Child, Family>)child).ThenInclude(f => f.Determinations);
				}
			}

			return child.FirstOrDefaultAsync();
		}
		public void AddChild(Child child)
		{
			_context.Add(child);
		}

		public void UpdateChild(Child child)
		{
			_context.Entry(child).State = EntityState.Modified;
		}

		public Task<int> SaveChangesAsync()
		{
			return _context.SaveChangesAsync();
		}
		public async Task<IDictionary<Guid, Child>> GetChildrenByIdsAsync_OLD(IEnumerable<Guid> ids, DateTime? asOf = null)
		{
			var dict = await GetBaseQuery<Child>(asOf)
				.Where(c => ids.Contains(c.Id))
				.ToDictionaryAsync(x => x.Id);
			return dict as IDictionary<Guid, Child>;
		}

		public async Task<Child> GetChildByIdAsync_OLD(Guid id, DateTime? asOf = null)
		{
			return await GetBaseQuery<Child>(asOf)
				.Where(c => c.Id == id)
				.SingleOrDefaultAsync();
		}
		public async Task<ILookup<int, Child>> GetChildrenByFamilyIdsAsync(IEnumerable<int> familyIds, DateTime? asOf = null)
		{
			var children = await GetBaseQuery<Child>(asOf)
				.Where(c => c.FamilyId != null && familyIds.Contains((int) c.FamilyId))
				.ToListAsync();

			return children.ToLookup(c => (int) c.FamilyId);
		}

		public Child UpdateFamily(Child child, Family family)
		{
			child.Family = family;
			return child;
		}

		public Child CreateChild(
		  string sasid,
			string firstName,
			string lastName,
			string middleName = null,
			string suffix = null,
			DateTime? birthdate = null,
			string birthCertificateId = null,
			string birthTown = null,
			string birthState = null,
			bool americanIndianOrAlaskaNative = false,
			bool asian = false,
			bool blackOrAfricanAmerican = false,
			bool nativeHawaiianOrPacificIslander = false,
			bool white = false,
			bool hispanicOrLatinxEthnicity = false,
			Gender gender = Gender.Unspecified,
			bool foster = false,
			int? familyId = null)
		{
			var child = new Child {
				Sasid = sasid,
				FirstName = firstName,
				MiddleName = middleName,
				LastName = lastName,
				Suffix = suffix,
				Birthdate = birthdate,
				BirthCertificateId = birthCertificateId,
				BirthTown = birthTown,
				BirthState = birthState,
				AmericanIndianOrAlaskaNative = americanIndianOrAlaskaNative,
				Asian = asian,
				BlackOrAfricanAmerican = blackOrAfricanAmerican,
				NativeHawaiianOrPacificIslander = nativeHawaiianOrPacificIslander,
				White = white,
				HispanicOrLatinxEthnicity = hispanicOrLatinxEthnicity,
				Gender = gender,
				Foster = foster
			};

			_context.Add<Child>(child);
			return child;
		}
	}

	public interface IChildRepository
	{
		Task<List<Child>> GetChildrenForOrganizationAsync(int organizationId, string[] include = null);
		Task<Child> GetChildForOrganizationAsync(Guid id, int organizationId, string[] include = null);
		void AddChild(Child child);
		void UpdateChild(Child child);
		Task<int> SaveChangesAsync();

		Task<IDictionary<Guid, Child>> GetChildrenByIdsAsync_OLD(IEnumerable<Guid> ids, DateTime? asOf = null);
		Task<Child> GetChildByIdAsync_OLD(Guid id, DateTime? asOf = null);
		Task<ILookup<int, Child>> GetChildrenByFamilyIdsAsync(IEnumerable<int> familyIds, DateTime? asOf = null);
		Child UpdateFamily(Child child, Family family);
		Child CreateChild(
		  string sasid,
			string firstName,
			string lastName,
			string middleName = null,
			string suffix = null,
			DateTime? birthdate = null,
			string birthCertificateId = null,
			string birthTown = null,
			string birthState = null,
			bool americanIndianOrAlaskaNative = false,
			bool asian = false,
			bool blackOrAfricanAmerican = false,
			bool nativeHawaiianOrPacificIslander = false,
			bool white = false,
			bool hispanicOrLatinxEthnicity = false,
			Gender gender = Gender.Unspecified,
			bool foster = false,
			int? familyId = null);
	}
}
