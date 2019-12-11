namespace Hedwig.Validations
{
  public sealed class ValidationError
  {

    public ValidationError(string field, string message)
    {
      Field = field;
      Message = message;
    }
    public readonly string Field;
    public readonly string Message;
  }
}