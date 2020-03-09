using Xunit;
using Hedwig.Models.Attributes;

namespace HedwigTests.Models.Attributes
{
	public class Entity
	{
		[ReadOnly]
		public object Property { get; set; }
	}
	public class ReadOnlyAttributeTests
	{
		[Theory]
		[InlineData(true)]
		[InlineData(false)]
		public void IsReadOnly_ReturnsTrueIfEntityHasReadOnlyAttribute(
			bool isReadOnly
		)
		{
			// if 
			object entity = isReadOnly ? (object)new Entity() : new { Property = new object() };
			// when
			var res = ReadOnlyAttribute.IsReadOnly(entity.GetType().GetProperty("Property"));

			// then
			Assert.Equal(isReadOnly, res);
		}
	}
}
