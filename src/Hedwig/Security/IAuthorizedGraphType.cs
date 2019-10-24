namespace Hedwig.Security
{
  public interface IAuthorizedGraphType
  {
      AuthorizationRules Permissions(AuthorizationRules rules);
  }
}