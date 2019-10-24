using System.Collections.Generic;
using GraphQL.Types;

namespace Hedwig.Schema.Mutations
{
    public interface IAppSubMutation
    {
        IEnumerable<FieldType> Fields { get; }
    }
}