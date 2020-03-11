# Read-Only Properties

## Context
The previous attempt at protecting read-only entities did not unset the values
until save-time, when they had already been loaded into the DB context.
For still unknown reasons, this sometimes caused problems with duplicate references
to the same DB entity in a single create/update object tree (i.e. when enrollment.author
and enrollment.site.author were set to the same User object). Additionally, developers
want the ability to mark any given property on a model as read-only as opposed
to marking types as unilaterally read-only

## Decision
An alternative solution, which is more flexible and allows for greater control
of the data model, enables specific properties on application models to be marked
read-only. These fields are un-set by an action filter that runs before the controller
actions are executed, and so solves the problem of duplicate User loads into DB context.
Additionally, it enables developers to set any field on a model as read-only,
regardless of type. The read-only attribute should apply to properties on application
models that should never be written. Un-setting of read-only entities no longer happens
at DB save-time.

## Status
* Proposed
* __Accepted__
* Rejected
* Superceded
* Accepted (Partially superceded)
(Choose one)

## Consequences
- Model types should no longer be marked read-only.
- Changes to fields marked read-only will be silently rejected.
