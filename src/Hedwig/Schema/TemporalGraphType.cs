using GraphQL.Types;
using System;

namespace Hedwig.Schema
{
    public class TemporalGraphType<T> : ObjectGraphType<T>
    {
        public const String AS_OF_KEY = "asOf";
        public static void SetAsOfGlobal(ResolveFieldContext<T> context, DateTime? asOf)
        {
            var userContext = context.UserContext as UserContext;
            userContext.GlobalArguments.Add(AS_OF_KEY, asOf);
        }

        public static DateTime? GetAsOfGlobal(ResolveFieldContext<T> context)
        {
            var userContext = context.UserContext as UserContext;
            return userContext.GlobalArguments.ContainsKey(AS_OF_KEY)
                ? (DateTime?) userContext.GlobalArguments["asOf"]
                : null;
        }
    }
}