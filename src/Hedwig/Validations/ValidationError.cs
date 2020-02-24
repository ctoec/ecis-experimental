using System.ComponentModel.DataAnnotations;

namespace Hedwig.Validations
{
  public sealed class ValidationError
  {

	public ValidationError(
	  string message,
	  bool isSubObjectValidation = false,
	  string field = null,
	  string[] fields = null
	)
	{
	  Message = message;
	  IsSubObjectValidation = isSubObjectValidation;
	  Field = field;
	  Fields = fields;
	}

	[Required]
	public readonly string Message;
	[Required]
	public readonly bool IsSubObjectValidation;
	public readonly string Field;
	public readonly string[] Fields;
  }
}
