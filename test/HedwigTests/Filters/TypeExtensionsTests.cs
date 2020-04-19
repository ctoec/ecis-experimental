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
		[InlineData(typeof(string), false)]
		[InlineData(typeof(IEnumerable<object>), true)]
		[InlineData(typeof(ICollection<object>), true)]
		[InlineData(typeof(List<object>), true)]
		public void IsNonStringEnumerable_ReturnsTrue_IfTypeIsEnumerableAndNotString(
			Type type,
			bool expectedResult
		)
		{
			var result = type.IsGenericEnumerable();
			Assert.Equal(expectedResult, result);
		}

		[Theory]
		[InlineData(typeof(object), typeof(object))]
		[InlineData(typeof(IEnumerable<object>), typeof(object))]
		public void GetEntityType_ReturnsItemType_IfEnumerable(
			Type type,
			Type expectedResult
		)
		{
			var result = type.GetGenericType();
			Assert.Equal(expectedResult, result);
		}

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
