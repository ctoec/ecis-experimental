using GraphQL.Types;
using System;

namespace Hedwig.Schema
{
    /// <summary>
    /// A generic ObjectGraphType with helper functions to get and set temporal query param `asOf`
    /// on the UserContext object
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class TemporalGraphType<T> : HedwigGraphType<T>
    {
        private const String AS_OF_KEY = "asOf";
        public static void SetAsOfGlobal(ResolveFieldContext<T> context, DateTime? asOf)
        {
            var requestContext = GetRequestContext(context);
            requestContext.GlobalArguments.Add(AS_OF_KEY, asOf);
        }

        public static DateTime? GetAsOfGlobal(ResolveFieldContext<T> context)
        {
            var requestContext = GetRequestContext(context);
            return requestContext.GlobalArguments.ContainsKey(AS_OF_KEY)
                ? (DateTime?) requestContext.GlobalArguments["asOf"]
                : null;
        }
    }
}