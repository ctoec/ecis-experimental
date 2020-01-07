# Custom Multi-Environment Definition

## Context
Standard environment definition in dotnet core application relies on an env variable: `ASPNETCORE_ENVIRONMENT`. However, due to our decision to host in AWS Elastic Beanstalk, we are unable to inject env variables into application runtime context. We provision env-specific configuration values by injecting them into `appsettings.json` during deployment, but need a way to set the environment for the web host as well, to enable env-specific application setup.


## Decision
A custom variable, `EnvironmentName`, is added to `appsettings.json`. During deployment, the correct environment name value is injected. The application then uses this value in `Program.cs` to correctly provision the WebHost, and to set the WebHost environment. Setting the environment with custom environment name value enables standard use of `IWebHostingEnvironment` in the application.

Additionally, as mentioned, we inject all values into `appsettings.json`. We do not adhere to the dotnet standard of creating multiple `appsettings.{Environment}.json` files, because they are loaded based on value of `ASPNETCORE_ENVIRONMENT`, which we cannot and do not use. `appsettings.json` is checked into the repo with default values for development.

## Status
* Proposed
* __Accepted__
* Rejected
* Superceded
* Accepted (Partially superceded)

## Consequences
- Enables environment-specific behavior in application, despite inability to set env vars for dotnet deployment in AWS Elastic Beanstalk
- Deviates from standard dotnet practices for handling multiple-env setup and configuration.
