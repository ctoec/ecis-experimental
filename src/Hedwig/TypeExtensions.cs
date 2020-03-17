using System;
using System.Collections;

namespace Hedwig
{
	public static class TypeExtensions
	{
		/// <summary>
		/// Returns true if given `type` is an enumerable collection of items
		/// that is not a string.
		/// </summary>
		/// <param name="type"></param>
		/// <returns></returns>
		public static bool IsNonStringEnumerable(this Type type)
		{
			if (type == typeof(string)) return false;
			return type.IsGenericType
				&& type.GetInterface(nameof(IEnumerable)) != null;
		}

		/// <summary>
		/// If the given `type` is a non-string enumerable collection, 
		/// returns the underlying item type. Otherwise, returns the 
		/// original `type`. Ex:
		/// 	GetEntityType(typeof(List<TInner>)) returns TInner
		/// 	GetEntityType(typeof(T)) returns T
		/// </summary>
		/// <param name="type"></param>
		/// <returns></returns>
		public static Type GetEntityType(this Type type)
		{
			return type.IsNonStringEnumerable()
				? type.GetGenericArguments()[0]
				: type;
		}

		/// <summary>
		/// Returns true if given `type` is an application model
		/// </summary>
		/// <param name="entityType"></param>
		/// <returns></returns>
		public static bool IsApplicationModel(this Type entityType)
		{
			return entityType.Namespace.Contains(nameof(Hedwig.Models))
				&& !(entityType.IsEnum);
		}
	}
}
