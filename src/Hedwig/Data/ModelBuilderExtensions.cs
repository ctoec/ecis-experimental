using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Hedwig.Data
{
  public static class ModelBuilderExtensions
  {
    public static ModelBuilder SetAllFKsOnDelete(this ModelBuilder modelBuilder, DeleteBehavior deleteBehavior)
    {
      foreach(var fk in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
      {
        fk.DeleteBehavior = deleteBehavior;
      }
      return modelBuilder;
    }
  }
}