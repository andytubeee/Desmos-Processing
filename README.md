# Processing Desmos

## Requirement

- Node.js LTS
- Yarn Package Manager
- processing-java (Processing CLI)

## Installation

```
# runs package installation script for both client and server

yarn run installpackages
```

## Running Everything

This will start the client, websocket server and the processing sketch

`yarn run start`

## Features

- Plot points
- Plot functions
- Evaluate Function
- Evaluate Function Derivative
- Plot a linear tangent to a function at x
- Compute Function's Derivative
- Summation
- Riemann Sum Integration (With real plot)
  - Left
  - Right
  - Midpoint
  - Trapezoidal

### Random 500 error?

Head to `frontend/data/<file>.json` and make sure it contains valid JSON and you are not writing changes yourself. In this program, every data is saved, which includes points and functions. This means when you close and re-open the app, all of your previously plotted functions and points will remain.

# No Node.js? No worries

This program can also function without a GUI and Websocket communication protocol if Node.js is not available. You can still use the program in regular processing. However, no data will be saved since the communication and fetching protocol is available

Go to `Graphing_Calculator.pde`, and turn on _debugMode_ by setting `debugMode = true;`

## Create a point

```java

```
