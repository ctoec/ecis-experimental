using System;
using System.Reflection;

namespace Hedwig.Models.Attributes
{
	public class ReadOnlyAttribute : Attribute
	{

		public static bool IsReadOnly(PropertyInfo property)
		{
			ReadOnlyAttribute attribute = (ReadOnlyAttribute)Attribute.GetCustomAttribute(property, typeof(ReadOnlyAttribute));
			return attribute != null;
		}
	}
}
