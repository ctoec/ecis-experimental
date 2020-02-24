using System;

namespace Hedwig.Models.Attributes
{
  public class ReadOnlyAttribute : Attribute
  {

	public static bool IsReadOnly(object entity)
	{
	  ReadOnlyAttribute attribute = (ReadOnlyAttribute)Attribute.GetCustomAttribute(entity.GetType(), typeof(ReadOnlyAttribute));
	  return attribute != null;
	}
  }
}
