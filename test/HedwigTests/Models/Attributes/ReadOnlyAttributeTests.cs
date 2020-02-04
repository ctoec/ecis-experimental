using Xunit;
using Moq;
using Hedwig.Models.Attributes;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using HedwigTests.Fixtures;

namespace HedwigTests.Models.Attributes
{
  [ReadOnly]
  public class ReadOnlyEntity {}
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
      var entity = isReadOnly ? new ReadOnlyEntity() : new object();

      // when
      var res = ReadOnlyAttribute.IsReadOnly(entity);

      // then
      Assert.Equal(isReadOnly, res);
    }
  }
}