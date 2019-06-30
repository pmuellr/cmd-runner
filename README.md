cmd-runner - runs commands
================================================================================

`cmd-runner` is a tool to help run multiple command-line programs and manage
their output.  Each command is defined in a stand-alone file, and when run,
will generate a new instance of it's output which will be available live,
and historically.


install
--------------------------------------------------------------------------------

    npm -g install pmuellr/cmd-runner


usage
--------------------------------------------------------------------------------

    cmd-runner <sub-command> <options>

`start` is the default sub-command

subcommands:

    start - starts the server

options:

    -c --config
    -h --help
    -v --version

environment variables:

    PORT    used as the `port` option, if it isn't specified
    DEBUG   generate diagnostic output


http api
--------------------------------------------------------------------------------

The http api generally accepts and returns JSON objects in request and
response bodies.  The shape of the APIs trends towards REST-y

Errors returned from the HTTP API will have the following JSON shape:

    { error: string }

### JSON structures

**`InvocationParameters`**
    {
      command: string,
      env: [string],
      args: [string],
      cwd: string,
    }

**`Command`**

    {
      id: string,
      name: string,
      ...InvocationParameters,
      osx: InvocationParameters,
      linux: InvocationParameters,
      windows: InvocationParameters,
    }

**`Output`**

    {
      id: string,
      command: Command,
      pid: number,
      timeStart: string, // iso date
      timeEnd: string,   // iso date
      timeRun: number, // seconds of timeEnd - timeStart
      length: number,
      processInfo: ProcessInfo,
      data: string
    }

**`ProcessInfo`**

see: https://www.npmjs.com/package/pidusage

    {
      cpu: number,       // percentage (from 0 to 100*vcore)
      memory: number,    // bytes
      ppid: number,      // PPID
      pid: number,       // PID
      ctime: number,     // ms user + system time
      elapsed: number,   // ms since the start of the process
      timestamp: number  // ms since epoch
    }

### GET /api

returns information about the HTTP API

result:

    200: { version: string }

### GET /api/commands

returns the list of commands available to run

result:

    200: { commands: [Command] }


### POST /api/commands/:commandID

run a command

result:

    200: { command: Command, outputID: string }

### GET /api/outputs/

get a list of commands which have output available

result:

    200: { commands: [Command] }

### GET /api/outputs/:commandID

get summary data of the outputs of a specific command

note the `data` property in the Output objects is not returned

result: 

  200: {
    outputs: [Output]
  }


### GET /api/outputs/:commandID/:outputID?since=lastLength

get the data about a specific output

when the `since` query parameter is used, the `data` property will only
contain data appended to the output after the specified length

result: 

  200: {
    output: Output
  }

