using System;

namespace Hedwig.Security
{
  public class AuthorizationRule
  {
    public string Policy { get; private set; }

    public AuthorizationAction Action { get; private set; }

    public AuthorizationRule(string policy, AuthorizationAction action)
    {
      Policy = policy;
      Action = action;
    }
  }

  public enum AuthorizationAction
  {
    Deny,
    DenyNot,
    Allow,
    AllowNot
  }

  public enum AuthorizationRuleResult
  {
    Success,
    Failure,
    Continue
  }

  public static class AuthorizationActionExtensions {
    public static AuthorizationRuleResult Assess(this AuthorizationAction action, bool error)
    {
      switch (action)
      {
          case AuthorizationAction.Allow:
            return error ? AuthorizationRuleResult.Continue : AuthorizationRuleResult.Success;
          case AuthorizationAction.Deny:
            return error ? AuthorizationRuleResult.Continue : AuthorizationRuleResult.Failure;
          case AuthorizationAction.AllowNot:
            return error ? AuthorizationRuleResult.Success : AuthorizationRuleResult.Continue;
          case AuthorizationAction.DenyNot:
            return error ? AuthorizationRuleResult.Failure : AuthorizationRuleResult.Continue;
          default:
            // Enum type not found
            throw new Exception();
      }
    }
  }
}