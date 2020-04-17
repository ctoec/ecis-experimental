using System;
using System.Reflection;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hedwig.Models.Attributes
{
	public static class PropertyInfoExtensions
	{
		public static bool IsNotMapped(this PropertyInfo property)
		{
			NotMappedAttribute attribute = (NotMappedAttribute)Attribute.GetCustomAttribute(property, typeof(NotMappedAttribute));
			return attribute != null;
		}
	}
}
