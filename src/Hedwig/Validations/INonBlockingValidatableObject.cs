using System.Collections.Generic;

namespace Hedwig.Validations
{
  public interface INonBlockingValidatableObject
  {
    List<ValidationError> ValidationErrors { get; set; }
  }
}