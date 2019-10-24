using Hedwig.Validations;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
  public class DataValidationIssueType : HedwigGraphType<DataValidationIssue>
  {
    public DataValidationIssueType()
    {
      Field(i => i.property);
      Field(i => i.message);
    }
  }
}
