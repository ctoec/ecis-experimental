# OEC App Experiments

![Beaker, one of the Muppets, is electrocuted](https://media.giphy.com/media/gJWNDpwdkMTew/giphy.gif)

## Setup - Local

### Step 1

Install (if you haven't already) [Node](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/lang/en/docs/install/), and [.NET Core](https://aka.ms/dotnetcoregs).

#### macOS-specific instructions

Install [Homebrew](https://brew.sh).

```sh
brew install node yarn && brew tap caskroom/cask && brew cask install dotnet
```

### Step 2

```sh
make install db-migrate
```

### Step 3

There is no step 3.

## Setup - Docker (compose)
Right now, the docker-compose project allows for rapid development of the client and server side applications with sql-server backend. Will not at present work with VSCode for debugging -- that's to come (probably)!
### Step 1

Install [Docker](https://docs.docker.com/install/) (and maybe docker-compose, but it comes included with Docker Desktop for Mac and Windows)

### Step 2

Bring up the project
```sh
$ docker-compose up -d
Creating network "ctoec-app-experiments_default" with the default driver
Creating ctoec-app-experiments_db_1 ... done
Creating ctoec-app-experiments_server_1 ... done
Creating ctoec-app-experiments_client_1 ... done
```

### Step 3

Set up for debugging with VS Code by copying `./launch.json` into `./.vscode/launch.json` 
```sh
$ cp ./launch.json ./.vscode/launch.json
```

### Step 4

Do stuff with your app ecosystem using docker-compose directly, or with helpful custom executables (which are also composed into some Make commands if that feels helpful)
#### execute dotnet commands in backend container
```sh
$ ./dc-dotnet [YOUR COMMANDS HERE]
```
#### execute yarn commands in client container
```sh
$ ./dc-yarn [YOUR COMMANDS HERE]
```
#### execute [sqlcmd](https://docs.microsoft.com/en-us/sql/tools/sqlcmd-utility?view=sql-server-2017) commands in db container (connection params are included by default)
```sh
$ ./dc-sqlcmd [YOUR COMMANDS HERE]
```
 
## Things you might want to do

| Task | CLI - Local | CLI - Docker | URL |
| ---- | --- | --- | --- |
| Run the app and watch for changes | `make watch` | N/A (app is running when containers are up) | [App](https://localhost:5001), [GraphQL Playground](https://localhost:5001/ui/playground) |
| Run client alone and watch for changes | `make watch-client` | N/A (client is running when 'client' container is up) | [Client](https://localhost:3000) |
| Run backend alone and watch for changes | `make watch-backend` | N/A (backend is running when 'backend' container is up) | |
| Run the [Storybook](https://storybook.js.org) | `make storybook` |`make dc-storybook` | [Storybook](http://localhost:9009) |
| Run the client tests and watch for changes | `make test-client` | `make dc-test-client` | |
| Run the backend tests and watch for changes | `make test-backend` | `make dc-test-backend` | |
| Apply new database migrations | `make db-migrate` | `make dc-db-migrate` | |
| Reset the database | `make db-reset` | `make dc-db-reset` | |
| Update GraphQL types | `make apollo-generate` | `make dc-apollo-generate` |  |
| Clean up without committing (frontend JS and CSS only) | `make prettier` | `make dc-prettier` | |
