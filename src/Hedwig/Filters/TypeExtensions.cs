using System;
using System.Collections;

namespace Hedwig.Filters
{
	public static class TypeExtensions
	{
		/// <summary>
		/// Returns true if given `type` is an application model
		/// </summary>
		/// <param name="entityType"></param>
		/// <returns></returns>
		public static bool IsApplicationModel(this Type type)
		{
			return type.Namespace.Contains(nameof(Hedwig.Models))
				&& !(type.IsEnum);
		}

		public static bool IsGenericEnumerable(this Type type)
		{
			return type.IsGenericType &&
				typeof(IEnumerable).IsAssignableFrom(type);
		}
	}
}
