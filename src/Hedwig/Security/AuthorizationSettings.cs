/*
 * Modified from https://github.com/graphql-dotnet/authorization/blob/8e7b3c70577c15ee45d16080eeba8273315b4e9c/src/GraphQL.Authorization/AuthorizationSettings.cs
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

using System;
using System.Collections.Generic;

namespace Hedwig.Security
{
    public class AuthorizationSettings
    {
        private readonly IDictionary<string, IAuthorizationPolicy> _policies;

        public AuthorizationSettings()
        {
            _policies = new Dictionary<string, IAuthorizationPolicy>(StringComparer.OrdinalIgnoreCase);
        }

        public IEnumerable<IAuthorizationPolicy> Policies => _policies.Values;

        public IEnumerable<IAuthorizationPolicy> GetPolicies(IEnumerable<string> policies)
        {
            var found = new List<IAuthorizationPolicy>();

            if (policies == null) { return found; }

            foreach (var name in policies)
            {
              if (_policies.ContainsKey(name))
              {
                found.Add(_policies[name]);
              }
            }

            return found;
        }

        public IAuthorizationPolicy GetPolicy(string name)
        {
            return _policies.ContainsKey(name) ? _policies[name] : null;
        }

        public void AddPolicy(string name, IAuthorizationPolicy policy)
        {
            _policies[name] = policy;
        }

        public void AddPolicy(string name, Action<AuthorizationPolicyBuilder> configure)
        {
            var builder = new AuthorizationPolicyBuilder();
            configure(builder);

            var policy = builder.Build();
            _policies[name] = policy;
        }
    }
}