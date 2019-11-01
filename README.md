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
__NOTE:__ If you are developing on a Windows machine, you need to set the `DOCKER_ON_WINDOWS` environment variable. The rest of the commands will be the same if followed directly from the README. If you use `docker-compose` directly, you will need to specify the windows compose file. That is, you must use `docker-compose -f docker-compose-windows.yaml`.

### Step 1

Install [Docker](https://docs.docker.com/install/) (and maybe docker-compose, but it comes included with Docker Desktop for Mac and Windows)

### Step 2

Create a (read-write) bind mount from the [`WingedKeys` repo](https://github.com/ctoec/winged-keys) to a top-level directory called `winged-keys`.

```bash
mkdir winged-keys
sudo mount -o bind [absolute path to winged-keys] winged-keys
```

**Note:** You cannot create a symlink. Docker Compose does not (and will not) implement following symlinks.

### Step 3

Bring up the project
```sh
$ make dc-start
Creating network "ctoec-app-experiments_default" with the default driver
Creating ctoec-app-experiments_db_1 ... done
Creating ctoec-app-experiments_server_1 ... done
Creating ctoec-app-experiments_client_1 ... done
```

### Step 4

It is recommended to run VSCode with the `Remote` extension installed,
and to use the `Existing Docker-Compose (Extend)` configuration to launch VSCode
inside the backend container itself. Configuration for this lives in `.devcontainer`.
With that approach, the default launch configurations created by VSCode will work for debugging.
If you want to run VSCode locally against the project, you will not get Intellisense,
or other C# language features from Omnisharp, but you can still debug using the 
`launch.json` checked in to this repo. Set up for debugging the dockerized app
with local VSCode by copying `./launch.json` into `./.vscode/launch.json`
```sh
$ cp ./launch.json ./.vscode/launch.json
```

### Step 4

Do stuff with your app ecosystem using docker-compose directly, or with helpful custom executables (which are also composed into some Make commands if that feels helpful)
#### execute commands in backend container in app directory (for instance, `dotnet [...]`)
```sh
$ ./dc-backend [YOUR COMMANDS HERE]
```
#### execute commends in backend container in test directory (for instance, `dotnet test`)
```sh
$ ./dc-test-backend [YOUR COMMANDS HERE]
```
NOTE: When running tests, you can supply flags in the form of environment variables to control test run configuration.
Available flags are:
- SQL_LOGGING: If this env var exists, the DbContext will be configured to log SQL to the console
- HTTP_LOGGING: If this env var exists, the integration tests will log raw HTTP response content
- RETAIN_OBJECTS: If this env var exists, the DbContext will _not_ automatically clean up all generated objects

#### execute commands in client container (for instance, `yarn [...]`)
```sh
$ ./dc-client [YOUR COMMANDS HERE]
```
#### execute [sqlcmd](https://docs.microsoft.com/en-us/sql/tools/sqlcmd-utility?view=sql-server-2017) commands in db container (connection params are included by default)
```sh
$ ./dc-sqlcmd [YOUR COMMANDS HERE]
```
NOTE: Access an interactive sqlcmd interface by running `./dc-sqlcmd` with no commands

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
