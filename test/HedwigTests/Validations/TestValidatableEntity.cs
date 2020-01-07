using Hedwig.Validations;
using System.Collections.Generic;

namespace HedwigTests.Validations
{

 public class TestValidatableEntity : INonBlockingValidatableObject
  {
    public string FieldName { get; set; }
    public List<ValidationError> ValidationErrors { get; set; }
  }
}