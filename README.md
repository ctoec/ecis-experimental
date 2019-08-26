# OEC App Experiments

![Beaker, one of the Muppets, is electrocuted](https://media.giphy.com/media/gJWNDpwdkMTew/giphy.gif)

## Setup

### Step 1

Install (if you haven't already) [Node](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/lang/en/docs/install/), and [.NET Core](https://aka.ms/dotnetcoregs).

#### macOS-specific instructions

Install [Homebrew](https://brew.sh).

```sh
brew install node yarn && brew tap caskroom/cask && brew cask install dotnet
```

### Step 2

```sh
make install
```

### Step 3

There is no step 3.

## Things you might want to do

| Task | CLI | URL |
| ---- | --- | --- |
| Run the app and watch for changes | `make watch` | [App](https://localhost:5001), [GraphQL Playground](https://localhost:5001/ui/playground) |
| Run client alone and watch for changes | `make client-watch` | [Client](https://localhost:3000) |
| Run backend alone and watch for changes | `make backend-watch` | |
| Run the [Storybook](https://storybook.js.org) | `make storybook` | [Storybook](http://localhost:9009) |
| Run the client tests and watch for changes | `make client-test` | |
| Run the backend tests and watch for changes | `make backend-test` | |
| Clean up without committing (frontend JS and CSS only) | `make prettier` | |