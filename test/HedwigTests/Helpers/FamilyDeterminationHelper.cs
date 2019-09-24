using System;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class FamilyDeterminationHelper
	{
		public const int NUMBER_OF_PEOPLE = 3;
		public const decimal INCOME = 20000M;
		public const string DETERMINED_STR = "2000-01-01";

		public static FamilyDetermination CreateDetermination(HedwigContext context)
		{
			var family = FamilyHelper.CreateFamily(context);
			var determination = new FamilyDetermination {
				NumberOfPeople = NUMBER_OF_PEOPLE,
				Income = INCOME,
				Determined = DateTime.Parse(DETERMINED_STR),
				FamilyId = family.Id
			};
			context.FamilyDeterminations.Add(determination);
			context.SaveChanges();
			return determination;
		}

		public static FamilyDetermination CreateDeterminationWithFamilyId(HedwigContext context, int familyId)
		{
			var determination = new FamilyDetermination {
				NumberOfPeople = NUMBER_OF_PEOPLE,
				Income = INCOME,
				Determined = DateTime.Parse(DETERMINED_STR),
				FamilyId = familyId
			};
			context.FamilyDeterminations.Add(determination);
			context.SaveChanges();
			return determination;
		}

	}
}
