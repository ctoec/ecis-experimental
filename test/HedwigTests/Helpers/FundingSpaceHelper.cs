using System;
using System.Collections.Generic;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public static class FundingSpaceHelper
	{

		public static FundingSpace CreateFundingSpace(
			HedwigContext context,
			int organizationId,
			FundingSource source = FundingSource.CDC,
			Age ageGroup = Age.Preschool,
			FundingTime time = FundingTime.Full,
			int capacity = 10
		)
		{
			var timeSplit = time != FundingTime.Split
				? null
				: new FundingTimeSplit
				{
					FullTimeWeeks = 42,
					PartTimeWeeks = 10
				};

			var space = new FundingSpace
			{
				OrganizationId = organizationId,
				Source = source,
				AgeGroup = ageGroup,
				Capacity = capacity,
				Time = time,
				TimeSplit = timeSplit
			};

			context.Add(space);
			context.SaveChanges();
			return space;
		}
	}
}
