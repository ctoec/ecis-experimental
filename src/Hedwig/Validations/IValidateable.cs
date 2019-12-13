using System.Collections.Generic;

namespace Hedwig.Validations
{
  public interface IValidateable
  {
    List<ValidationError> ValidationErrors { get; set; }
  }
}