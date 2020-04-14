using System;
using Xunit;
using System.Collections.Generic;
using Hedwig.Filters;
using HedwigTests.Hedwig.Models;

namespace HedwigTests.Filters
{
	public class TypeExtensionTests
	{
		[Theory]
		[InlineData(typeof(object), false)]
		[InlineData(typeof(ApplicationModel), true)]
		public void IsApplicationModel_ReturnsTrue_IfTypeIsAppliationModel(
			Type type,
			bool expectedResult
		)
		{
			var result = type.IsApplicationModel();
			Assert.Equal(expectedResult, result);
		}
	}
}
