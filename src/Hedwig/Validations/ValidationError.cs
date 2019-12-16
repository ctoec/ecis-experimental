using System.ComponentModel.DataAnnotations;

namespace Hedwig.Validations
{
  public sealed class ValidationError
  {

    public ValidationError(string field, string message)
    {
      Field = field;
      Message = message;
    }
    [Required]
    public readonly string Field;
    [Required]
    public readonly string Message;
  }
}