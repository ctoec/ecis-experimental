using System.ComponentModel.DataAnnotations;

namespace Hedwig.Validations
{
  public sealed class ValidationError
  {

    public ValidationError(string message, string field = null, string[] fields = null)
    {
      Message = message;
      Field = field;
      Fields = fields;
    }

    [Required]
    public readonly string Message;
    public readonly string Field;
    public readonly string[] Fields;
  }
}