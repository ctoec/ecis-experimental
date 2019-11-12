using System.Collections;
using System.Collections.Generic;

namespace Hedwig.Security
{
  public class AuthorizationRules : IEnumerable<AuthorizationRule>
  {
    private readonly List<AuthorizationRule> _rulesSet = new List<AuthorizationRule>();

    public AuthorizationRules Allow(string policy = "")
    {
      _rulesSet.Add(new AuthorizationRule(policy, AuthorizationAction.Allow));
      return this;
    }

    public AuthorizationRules Deny(string policy = "")
    {
      _rulesSet.Add(new AuthorizationRule(policy, AuthorizationAction.Deny));
      return this;
    }

    public AuthorizationRules AllowNot(string policy = "")
    {
      _rulesSet.Add(new AuthorizationRule(policy, AuthorizationAction.AllowNot));
      return this;
    }

    public AuthorizationRules DenyNot(string policy = "")
    {
      _rulesSet.Add(new AuthorizationRule(policy, AuthorizationAction.DenyNot));
      return this;
    }

    public IEnumerator<AuthorizationRule> GetEnumerator()
    {
        return _rulesSet.GetEnumerator();
    }

    private IEnumerator _GetEnumerator()
    {
        return this.GetEnumerator();
    }
    IEnumerator IEnumerable.GetEnumerator()
    {
        return _GetEnumerator();
    }
  }
}