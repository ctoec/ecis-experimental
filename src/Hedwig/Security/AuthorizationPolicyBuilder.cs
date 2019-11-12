/*
 * Modified from https://github.com/graphql-dotnet/authorization/blob/8e7b3c70577c15ee45d16080eeba8273315b4e9c/src/GraphQL.Authorization/AuthorizationPolicyBuilder.cs
 */
/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Joseph T. McBride
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in the
 * Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * Summary of Changes
 * - Remove unused methods.
 */

using System.Collections.Generic;
using System.Linq;

namespace Hedwig.Security
{
    public class AuthorizationPolicyBuilder
    {
        private readonly List<IAuthorizationRequirement> _requirements;

        public AuthorizationPolicyBuilder()
        {
            _requirements = new List<IAuthorizationRequirement>();
        }

        public AuthorizationPolicy Build()
        {
            var policy = new AuthorizationPolicy(_requirements);
            return policy;
        }

        public AuthorizationPolicyBuilder AddRequirement(IAuthorizationRequirement requirement)
        {
            _requirements.Add(requirement);
            return this;
        }
    }
}