# Security and Permissions Flow

## Context
`Hedwig` uses GraphQL and Dotnet Core. There is one open-source library (`GraphQL.Authorization`) that provides Authorization to the Dotnet+GraphQL world. It currently is in preview mode for v3, which requires Dotnet Core 3.0. `Hedwig` uses Dotnet Core 2.2. `Hedwig` requires robust permissioning on API endpoints, and the developer desire authorization requirements to be semantically meaningful. `GraphQL.Authorization` only implements on conjunction requirements-base policies. Disjunction or heirarchial policies must be implemented within individual requirement classes.

## Decision
The team decided to pull down source code from `GraphQL.Authorization` to provide customization to the authorization flow.

### Flow
Authorization in GraphQL is implemented as a validation rule (see `AuthorizationValidationRule.cs`). This class walks the GraphQL AST and validates each node against the permissions registered on that node. `AuthorizationValidationRule` calls the `Authorize` method on the node type. This is an extension method provided by `AuthorizationMetadataExensions`.

`AuthorizationMetadataExensions#Authorize` retrieves the permission rules registered on the node type and calls `AuthorizationEvaluator#Evalute`.

Permission rules are retrieved by calling the `Permissions` method which is implemented by all types implementing the `IAuthorizedGraphType`. This method returns a `AuthorizationRules` object.

`AuthorizationRules` is an enumerable collection of `AuthorizationRule` objects. An `AuthorizationRule` is a combination of an `AuthorizationAction` and an `IAuthorizationPolicy`.

`AuthorizationEvaluator#Evalute` iterates over the rules in the `AuthorizationRules` object. For each rule, it iterates over the requirements. On each requirement, `Evaluate` determines whether an error occured. If any one of the requirements produced an error, the result for the policy is an error. Otherwise, the result of the policy is no error. The action corresponding to this `AuthorizationRule` is then used to determine whether to succeed, fail, or continue. `AuthorizationAction`s have an extension method defined `Assess` that takes in a single boolean corresponding to whether the result of the policy was an error. `Assess` returns an `AuthorizationRuleResult`.

The first `AuthorizationRuleResult` that is not `Continue` (i.e. `Success` or `Failure`) reports to `Evaluate` accordingly. If the result is `Continue` the iteration over `AuthorizationRules` continues. (The final rule should be `Allow` or `Deny` to ensure that every request receives a final determination.)

Control is returned to `AuthorizationValidationRule` where the request continues to the query or an error is reported and an early response is sent.

## Status
* Proposed
* __Accepted__
* Rejected
* Superceded
* Accepted (Partially superceded)

## Consequences
* Upstream changes to `GraphQL.Authorization` must be manually added.
* `Hedwig` gets access to v3 features of `GraphQL.Authorization`.
* More semantic permissions policy flow.
* Greater customization possibilities for authorization flow.