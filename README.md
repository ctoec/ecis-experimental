# ECE Reporter

[ECE Reporter](https://reporter.ecereporterpilot.com) is a software managed by the [Office of Early Childhood in Connecticut](https://ctoec.org) (OEC). It enables early childhood education providers to sumbit required reports to OEC. It replaces ECIS and automatically generates PSR reports.

## Name
The public facing name of this project is "ECE Reporter". The interal name used in the source code is Hedwig.

## Setup

You will need to `git clone` the WingedKeys repository regardless of which setup you choose below.

Install appropriate git commit from `/hooks` directory, following instructions in comments.

### Windows (Local)

#### Step 1

Install (if you haven't already) Visual Studio, [Node 12](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/lang/en/docs/install/), [.NET Core](https://aka.ms/dotnetcoregs), and dotnet-ef.

#### Step 1b

If you have Visual Studio 2015 or earlier installed, you will also need to install LocalDB.

#### Step 2

Select `Hedwig` as the Start Up project if it has not already been selected.

#### Step 3

Create a `wingedkeys` database from the `SQL Object Explorer` window.

#### Step 4

Apply the migrations to the `master` (default for the `Hedwig` in development) database. In the Package Manager Console of Visual Studio, run either `Update-Database -Project .\src\Hedwig` or `dotnet ef database update --project .\src\Hedwig`.

#### Step 5

Apply the migrations to the `wingedkeys` database. In the Package Manager Console of Visual Studio, run either the following:

Option 1:
`Update-Database -Project .\src\WingedKeys -Context PeristedGrantDbContext`

`Update-Database -Project .\src\WingedKeys -Context ConfigurationDbContext`

`Update-Database -Project .\src\WingedKeys -Context WingedKeysContext`

Option 2:
`dotnet ef database update --project .\src\WingedKeys --context PeristedGrantDbContext`

`dotnet ef database update --project .\src\WingedKeys --context ConfigurationDbContext`

`dotnet ef database update --project .\src\WingedKeys --context WingedKeysContext`

### Windows (Docker)

We currently do not support development on Windows with Docker.

Exception: If you are developing on Windows with WSLv2 (WSLv1 is not [well] supported), you may instead follow along with the Linux/Mac (Docker + Docker Compose) instructions.

### Linux (Local)

#### Step 1

Install (if you haven't already) [Node 12](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/lang/en/docs/install/), [.NET Core](https://aka.ms/dotnetcoregs), and dotnet-ef.

#### Step 2

```sh
make install db-migrate
```

### Mac (Local)

#### Step 1
Install [Homebrew](https://brew.sh).

#### Step 2
Install and link Node 12 (linking is necessary because LTS versions of Node are keg-only by default):

```sh
brew install node@12 && brew link --force --overwrite node@12
```

#### Step 3

```sh
brew install yarn && brew tap caskroom/cask && brew cask install dotnet
```

#### Step 3

```sh
make install db-migrate
```

### Linux/Mac (Docker + Docker Compose)

#### Step 1

Install [Docker](https://docs.docker.com/install/) (and maybe [Docker Compose](https://docs.docker.com/compose/install/), but it comes included with Docker Desktop for Mac)

#### Step 2

Create a (read-write) bind mount from the [`WingedKeys` repo](https://github.com/ctoec/winged-keys) to a top-level directory called `winged-keys`.

```bash
mkdir winged-keys
sudo mount -o bind [absolute path to winged-keys] winged-keys
```

**Note:** You cannot create a symlink. Docker Compose does not (and will not) implement following symlinks.

As an alternative to creating a bind mount, you can move the WingedKeys repostiory you already cloned inside of this project directory.

### Step 3

Bring up the project
```sh
$ make dc-start
```

## Development

### Windows

#### Visual Studio

##### Building

Select "Build Solution" option in the "Build" context menu. Keyboard shortcut: `Ctrl+Shift+B`.

Build the `WingedKeys` solution. Do the same as the above in a new Visual Studio window in which the `WingedKeys` solution is opened.

##### Running

Note: `Hedwig` (and `WingedKeys`) is not runnable behind IIS in local development. You must run the project with Project or Executable configurations. These are included in `launchSettings.json`.

First start `WingedKeys`.

In the Visual Studio window with `WingedKeys` loaded, run the `WingedKeys` project launch settings profile. Keyboard shortcut: `Ctrl+F5`.

No browser window will automatically open. However, the project will be running bound to `https://localhost:5050`.

Then start `Hedwig`.

In the Visual Studio window with `Hedwig` loaded, run either the `Hedwig` or `HedwigWatch` project launch settings profiles. Keyboard shortcut: `Ctrl+F5` (you may need to update the `Hedwig` properties under the `Debug` context menu to select which profile is run with the keyboard shortcut).

A browser window should automatically open to `https://localhost:5001`. It may take several seconds (up to a minute) for the project to run the inital database seeding and for the React app to compile. During that time, you will see a blank screen.

### Linux/Mac or WSLv2

#### Docker + Docker Compose

All of the building and running of the application is handled for you.  You'll just want to make sure that Docker has **at least 4 GB of RAM** allocated to it from your machine, so that you don't run out of memory as you're spinning up (particularly because of SQL Server and the initial migrations being run).

##### Visual Studio Code
It is recommended to run VSCode with the `Remote` extension installed, and to use the `Existing Docker-Compose (Extend)` configuration to launch VSCode inside the backend container itself. Configuration for this lives in `.devcontainer`. With that approach, the default launch configurations created by VSCode will work for debugging. If you want to run VSCode locally against the project, you will not get Intellisense, or other C# language features from Omnisharp, but you can still debug using the `launch.json` checked in to this repo. Set up for debugging the dockerized app with local VSCode by copying `./launch.json` into `./.vscode/launch.json`
```sh
$ cp ./launch.json ./.vscode/launch.json
```

##### Command Line Tools

Do stuff with your app ecosystem using docker-compose directly, or with helpful custom executables (which are also composed into some Make commands if that feels helpful)

###### execute commands in backend container in app directory (for instance, `dotnet [...]`)
```sh
$ ./dc-backend [YOUR COMMANDS HERE]
```

###### execute commends in backend container in test directory (for instance, `dotnet test`)
```sh
$ ./dc-test-backend [YOUR COMMANDS HERE]
```
NOTE: When running tests, you can supply flags in the form of environment variables to control test run configuration.
Available flags are:
- SQL_LOGGING: If this env var exists, the DbContext will be configured to log SQL to the console
- HTTP_LOGGING: If this env var exists, the integration tests will log raw HTTP response content
- RETAIN_OBJECTS: If this env var exists, the DbContext will _not_ automatically clean up all generated objects

###### execute commands in client container (for instance, `yarn [...]`)
```sh
$ ./dc-client [YOUR COMMANDS HERE]
```

###### execute [sqlcmd](https://docs.microsoft.com/en-us/sql/tools/sqlcmd-utility?view=sql-server-2017) commands in db container (connection params are included by default)
```sh
$ ./dc-sqlcmd [YOUR COMMANDS HERE]
```
NOTE: Access an interactive sqlcmd interface by running `./dc-sqlcmd` with no commands

#### Local

##### Building

Run
```sh
$ dotnet build
```

Run the same command in the `winged-keys` directory.

##### Running

Start `WingedKeys` first.

Run
```sh
$ cd winged-keys && dotnet run --urls https://localhost:5050
```

To bring up the project, run the following:

Then start `Hedwig`
```sh
$ dotnet run --urls "http://localhost:5000;https://localhost:5001"
```

To bring up the project with hot reloading, do the following:

Then start `Hedwig` in watch mode
```sh
$ dotnet watch run --urls "http://localhost:5000;https://localhost:5001"
```

#### Things you might want to do

| Task | CLI - Local | CLI - Docker | URL |
| ---- | --- | --- | --- |
| Run the app and watch for changes | `make watch` | N/A (app is running when containers are up) | [App](https://localhost:5001) |
| Run client alone and watch for changes | `make watch-client` | N/A (client is running when 'client' container is up) | [Client](https://localhost:3000) |
| Run backend alone and watch for changes | `make watch-backend` | N/A (backend is running when 'backend' container is up) | |
| Run the [Storybook](https://storybook.js.org) | `make storybook` |`make dc-storybook` | [Storybook](http://localhost:9009) |
| Run the client tests and watch for changes | `make test-client` | `make dc-test-client` | |
| Run the backend tests and watch for changes | `make test-backend` | `make dc-test-backend` | |
| Apply new database migrations | `make db-migrate` | `make dc-db-migrate` | |
| Reset the database | `make db-reset` | `make dc-db-reset` | |
| Clean up without committing (frontend JS and CSS only) | `make prettier` | `make dc-prettier` | |
| Clean up without committing (backend CS only) | `make dotnet-format` | `make dc-dotnet-format` | |
