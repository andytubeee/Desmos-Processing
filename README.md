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

### In processing

- Move the cartesian plane around using **WASD**
- Zoom in/out using **Z**, and **X**

### Using Web app GUI

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

### More bugs?

Simply close connection and re-run `yarn run start`. Or be brave: Fork the repository, and fix the bug yourself. :)

# No Node.js? No worries

This program can also function without a GUI and Websocket communication protocol if Node.js is not available. You can still use the program in regular processing. However, your data is not saved.

Go to `Graphing_Calculator.pde`, and turn on _debugMode_ by setting `debugMode = true;`

## Create a point

```java
Point p = new Point(x, y, id);
p.drawPoint(); // draws point to the screen
p.undraw(); // removes the point from the screen.
```

## Create a function and its features

```java

Function f = new Function("sin(x)", "function_id");

f.graph(); // Graphs the function

f.evaluate(3.14); // Evaluates the function f at x = 3.14

f.evaluateDerivative(5); // Evaluates the derivative of the function f and x = 5;

f.plotTangent(0); // Plots a tangent on function f at x = 0;

f.summation(1, 5); // Evaluates the summation (Sigma) from 1 to 5.

```

Not satisfied with the features? You can also contribute to this project yourself. 
