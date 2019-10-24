using GraphQL.Types;
using Hedwig.Schema.Mutations;
using System.Collections.Generic;

namespace Hedwig.Schema
{
    public class AppMutation : ObjectGraphType<object>
    {
        public AppMutation(IEnumerable<IAppSubMutation> appSubMutations)
        {
            foreach(var mutation in appSubMutations) {
                foreach (var field in mutation.Fields) {
                    AddField(field);
                }
            }
            
        }
    }
}