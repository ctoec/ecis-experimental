# Read Only Properties

## Context
The previous approach to handling read-only entities was not sufficient to handle the case for author `User` properties on temporal entities.
While updating fundings with the same ReportingPeriod reference (i.e. same reporting period as first and last) did not cause errors, updating
nested entities with references to the same user (i.e. Enrollment.Author = Enrollment.Child.Author) results in an [`InvalidOperationException`](https://github.com/ctoec/ecis-experimental/issues/757)
A hacky fix was implemented to only add the User entity to Enrollment, and not nested temporal entities, but this is likely to cause other problems as we move into other use cases.

## Decision
The ReadOnlyAttribute has been reimagined as an attribute that should be applied to properties on models, not entire models.
This gives us more flexibility to enable automated API creation of entities like Users or ReportingPeriods, while ensuring they are
not updated or created by the creation or mutation of entities with read-only references to these objects.


## Status
* Proposed
* __Accepted__
* Rejected
* Superceded
* Accepted (Partially superceded)
(Choose one)

## Consequences
- Creation or mutation of read-only property on an entity is silently ignored
- Link to read-only property must be created via Id, as opposed to by linking to the object
(Adding an author to a temporal entity must be done by populating `AuthorId`; adding `Author` object will be ignored)
