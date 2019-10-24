namespace Hedwig.Validations
{
  public struct DataValidationIssue
  {
    public readonly string property, message;

    public DataValidationIssue(string p, string m)
    {
      property = p;
      message = m;
    }
  }
}
