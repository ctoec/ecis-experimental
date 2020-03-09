using System;
using System.Reflection;

namespace Hedwig.Models.Attributes
{
	public class ReadOnlyAttribute : Attribute
	{

		public static bool IsReadOnly(object entity)
		{
			ReadOnlyAttribute attribute = (ReadOnlyAttribute)Attribute.GetCustomAttribute(entity.GetType(), typeof(ReadOnlyAttribute));
			return attribute != null;
		}

		public static bool IsReadOnly(PropertyInfo property)
		{
			ReadOnlyAttribute attribute = (ReadOnlyAttribute)Attribute.GetCustomAttribute(property, typeof(ReadOnlyAttribute));
			return attribute != null;
		}
	}
}
