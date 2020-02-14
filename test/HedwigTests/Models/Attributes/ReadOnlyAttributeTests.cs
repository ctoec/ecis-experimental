using Xunit;
using Moq;
using Hedwig.Models.Attributes;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using HedwigTests.Fixtures;

namespace HedwigTests.Models.Attributes
{
  public class Entity {
    [ReadOnly]
    public string ReadOnlyProperty { get; set; }
    public string WriteableProperty { get; set; }
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
      var property = isReadOnly ? typeof(Entity).GetProperty("ReadOnlyProperty") : typeof(Entity).GetProperty("WriteableProperty");

      // when
      var res = ReadOnlyAttribute.IsReadOnly(property);

      // then
      Assert.Equal(isReadOnly, res);
    }
  }
}