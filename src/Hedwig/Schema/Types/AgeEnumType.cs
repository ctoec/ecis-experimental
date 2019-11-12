using Hedwig.Models;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
    public class AgeEnumType : EnumerationGraphType<Age>
    {
        public AgeEnumType()
        {
            Name = "Age";
        }
    }
}