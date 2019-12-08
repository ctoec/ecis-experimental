# GraphQL to REST Backend

## Context
The ECIS team initially undertook the Hedwig Project with `GraphQL`. `GraphQL` is a Facebook-supported technology that simplifies data fetching on the front-end and allows for faster feature development. The team is also using Dotnet Core (see other LADs) for the backend. Through the course of development, the team learned that while there is a Dot Net Core implementation of `GraphQL`, it is only maintained by one or two people. Further, the team was building out core functionality that they felt would require a greater lift of OEC staff to understand and maintain. Dotnet Core provides extremely robust support for traditional MVC/REST APIs. Microsoft also provides detailed documentation.

## Decision
During the onsite visit at the beginning of Decemeber, the team decided to reimplement the code to not use `GraphQL` and instead follow a REST approach. The team also decided to use Open API Generator (formerly Swagger) to handle the code generator for data fetching, providing a client-side API to request/mutate data.

Through the migration/refactor, the team decided to maintain `GraphQL` alongside the new REST code until they reached feature parity with the `GraphQL` implementation.

As part of this, the team also decided to migrate from Dotnet Core 2.2 to 3.0 as it is the newest version of Dotnet Core.

## Status
* Proposed
* __Accepted__
* Rejected
* Superceded
* Accepted (Partially superceded)

## Consequences
* This requires a substantial rewrite of both back end and front end code.
* Backend: Add controller classes, remove GraphQL code.
* Frontend: Add new state management solution, add data fetching mechanism; remove Apollo code.
* OEC is better equipped to support and maintain the project.
* The team is able to develop new features more quickly and ensure better security best practices.
* The migration of Dotnet Core 2.2 to 3.0 requires removing obsolete methods.