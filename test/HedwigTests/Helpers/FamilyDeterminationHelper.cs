using System;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class FamilyDeterminationHelper
	{
		public static FamilyDetermination CreateDetermination(
			HedwigContext context,
			int numberOfPeople = 3,
			decimal income = 20000M,
			string determined = "2000-01-01",
			Family family = null
		)
		{
			family = family ?? FamilyHelper.CreateFamily(context);

			var determination = new FamilyDetermination
			{
				NumberOfPeople = numberOfPeople,
				Income = income,
				Determined = DateTime.Parse(determined),
				FamilyId = family.Id
			};

			context.FamilyDeterminations.Add(determination);
			context.SaveChanges();
			return determination;
		}
	}
}
