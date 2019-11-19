using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;
using System.Threading;

namespace Hedwig.Repositories
{
	public class ChildRepository : TemporalRepository, IChildRepository
	{
		public ChildRepository(HedwigContext context) : base(context) {}

		public async Task<IDictionary<Guid, Child>> GetChildrenByIdsAsync(IEnumerable<Guid> ids, DateTime? asOf = null)
		{
			var dict = await GetBaseQuery<Child>(asOf)
				.Where(c => ids.Contains(c.Id))
				.ToDictionaryAsync(x => x.Id);
			return dict as IDictionary<Guid, Child>;
		}

		public async Task<Child> GetChildByIdAsync(Guid id, DateTime? asOf = null)
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
		Task<IDictionary<Guid, Child>> GetChildrenByIdsAsync(IEnumerable<Guid> ids, DateTime? asOf = null);
		Task<Child> GetChildByIdAsync(Guid id, DateTime? asOf = null);
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
