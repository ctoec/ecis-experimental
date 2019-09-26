using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System;

namespace Hedwig.Schema
{
    public class UserContext
    {      
        public static Func<HttpContext, UserContext> UserContextCreator = httpCtx => new UserContext();
        public IDictionary<string, object> GlobalArguments { get; set; }

        public UserContext()
        {
            GlobalArguments = new Dictionary<string, object>();
        }
    }
}
