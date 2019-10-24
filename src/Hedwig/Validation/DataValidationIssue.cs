namespace Hedwig.Validations
{
  public struct DataValidationIssue
  {
    public string property, message;

    public DataValidationIssue(string p, string m)
    {
      property = p;
      message = m;
    }
  }
}
