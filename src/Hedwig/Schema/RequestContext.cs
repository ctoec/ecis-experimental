using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System;
using System.Security.Claims;
using GraphQL.Authorization;
using System.Threading.Tasks;

namespace Hedwig.Schema
{
    /// <summary>
    /// "UserContext" is an extensible, user-created and defined abstract property that can be accessed by all
    /// resolvers in a request  (https://graphql-dotnet.github.io/docs/getting-started/user-context/). In conjunction 
    /// with graphql-dotnet/server GraphQLHttpMiddleware, a user context will be created if an appropriate user context
    /// builder exists in the http context (https://github.com/graphql-dotnet/server/blob/3.4/src/Transports.AspNetCore/GraphQLHttpMiddleware.cs#L81).
    /// To easily implement an IUserContextBuilder, we take advantage of a graphQL builder function that takes a "creator"
    /// function and wraps it in a base UserContextBuilderClass.
    /// (https://github.com/graphql-dotnet/server/blob/3.4/src/Transports.AspNetCore/GraphQLHttpMiddleware.cs#L81)
    ///
    /// RequestContext is the concrete class this API implements to act as a UserContext, and RequestContextCreator
    /// is the creator function passed to the graphQL builder <see cref="ServiceExtensions.ConfigureGraphQL" />
    /// </summary>
    public class RequestContext : Dictionary<string, object>, IProvideClaimsPrincipal
    {
        /// <summary>
        /// The creator function to pass to GraphQLBuilder.AddUserContextBuilder()
        /// </summary>
        /// <returns>an instantiated RequestContext</returns>
        public static readonly Func<HttpContext, RequestContext> RequestContextCreator = httpCtx => 
            new RequestContext(httpCtx.User);

        /// <summary>
        /// A dictionary of arguments to make globally available to an entire query execution context
        /// </summary>
        public IDictionary<string, object> GlobalArguments { get; set; }

        private ClaimsPrincipal _user { get; set; }

        public ClaimsPrincipal User {
            get { return _user; }
        }

        public RequestContext(ClaimsPrincipal user = null)
        {
            GlobalArguments = new Dictionary<string, object>();
            _user = user;
        }
    }
}
