# BrowserStack

## Context
The team decided that E2E testing was a necessary and valuable course of action. When Selenium Grid was added with Docker containers, only Firefox and Chrome were able to be added. Edge and IE cannot run in a Linux container. Most of our users us or are expected to use Edge and IE. BrowserStack is a SaaS for automated testing in different browsers that is free for open source projects.

## Decision
The team decided to use BrowserStack, and the team applied for an open-source account for CT OEC. The account is valid for one-year before it has to be renewed. BrowerStack was added both as a local feature and in our CI/CD pipeline, Azure Devops. The E2E tests runs as a release stage after a successful deploy to an environment.

### Implementation and Notes
BrowserStack does not use organizational credentials. Instead, directly according from their support team, teams should use an individuals credentials in the CI/CD pipeline. We decided to use Cailyn's credentials in all environments. Developers should use their own when testing locally.

## Status
* Proposed
* __Accepted__
* Rejected
* Superceded
* Accepted (Partially superceded)

## Consequences
* Developers must set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY environment variables to test in browsers other than latest firefox and chrome
* Developers must have an account with CT OEC's BrowserStack project (Note there is a limit of 5 accounts per organization)
* E2E testing won't work on Windows without additional work
* `yarn test` only tests non-E2E tests
* `yarn test:e2e` runs the E2E tests locally
* `yarn test:e2e:browserstack` runs the E2E tests in BrowserStack
* If running tests in BrowserStack, a public URL or BrowserStack local tunnel must be used
* A renewal application must be submitted in a year to BrowserStack
