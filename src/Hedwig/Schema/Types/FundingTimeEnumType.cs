using Hedwig.Models;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
    public class FundingTimeEnumType : EnumerationGraphType<FundingTime>
    {
        public FundingTimeEnumType()
        {
            Name = "FundingTime";
        }
    }
}