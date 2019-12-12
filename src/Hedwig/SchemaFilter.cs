using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.OpenApi.Models;
using System.Linq;

namespace Hedwig
{
  public sealed class SchemaFilter : ISchemaFilter
  {
    public void Apply(OpenApiSchema model, SchemaFilterContext context)
    {
      var type = context.ApiModel.Type;

      if(model.Properties == null || model.Properties.Count == 0)
      {
        return;
      }

      MakeStringTypePropertiesNonNullable(model);  
    }

    /// <summary>
    /// All string-type properties on API models should be non-nullable.
    /// NOTE - applies to multiple openAPI format types, which are represented as strings,
    /// including:
    ///   - string
    ///   - uuid
    ///   - date-time
    ///   - 
    /// </summary>
    /// <param name="model"></param>  
    private void MakeStringTypePropertiesNonNullable(OpenApiSchema model)
    {
      var types = new string[]{"string"};
      foreach (var property in model.Properties)
      {
        if (types.Contains(property.Value.Type))
        {
          property.Value.Nullable = false;
        }
      }
    }
  }
}
