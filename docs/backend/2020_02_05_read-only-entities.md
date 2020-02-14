# Read-Only Entities

## Context
We need to protect certain entities from ever being created or updated by API users.
These entities are only ever created by admin processes. Dotnet MVC framework does not
have a single idiomatic way of implementing read-only entities. A few options are highlighted [here](https://docs.microsoft.com/en-us/ef/core/modeling/constructors#read-only-properties),
but did not meet requirements of being:
- simple to add to new models
- simple to glean from looking at model code
- simple to integrate with existing data bootstrapping for tests
- actually 100% blocking creation/update of entities

## Decision
A custom Attribute, ReadOnlyAttribute, was created. HedwigContext `SaveChanges` and
`SaveChangesAsync` methods were overridden to first make a call to `ProtectReadOnlyEntities`
which discards additions of or updates to entities with ReadOnlyAttribute. [This github issue](https://github.com/dotnet/efcore/issues/7586)
served as inspiration for the implementation, however we did not use SQL metadata, but rather a vanilla
EF Core Attribute.


## Status
* Proposed
* Accepted
* Rejected
* __Superceded__
* Accepted (Partially superceded)

## Consequences
- Creating or updating a read-only entity via the API fails silently
