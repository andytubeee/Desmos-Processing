class Function {
  String function, id;
  color c;
  private color[] hexcodes = new color[] {#32a852, #20e8ca, #592ff5, #fa0a4a, #f5f0f1};
  boolean graphed = false;

  Function tangent = null;

  public Function(String func, color c) {
    this.function = func;
    this.c = c;
  }
  public Function(String func) {
    this.function = func;
    this.c = useColour();
  }
  public Function(String func, String id) {
    this.function = func;
    this.c = useColour();
    this.id = id;
  }
  private void addFunctionToCollection() {
    for (Function f : functions) {
      if (f.id.equals(this.id)) return;
    }
    functions.add(this);
  }
  private color useColour() {
    return this.c == 0 ? hexcodes[(int)random(hexcodes.length-1)] : c;
  }
  private float f(float x) {
    Expression e = new ExpressionBuilder(function)
      .variables("x")
      .build()
      .setVariable("x", x);
    try {
      return (float) e.evaluate();
    }
    catch (ArithmeticException ae) {
      return 10e10;
    }
  }
  public float compute(float x) {
    return f(x);
  }

  public float summation(int a, int b) {
    float sum = 0;
    for (int i = a; i <= b; i++) {
      sum += f(i);
    }
    return sum;
  }

  public float computeDerivative(float x) {
    float h = 10e-4;
    float ddxleft = (f(x)-f(x-h))/h, ddxright = (f(x+h)-f(x))/h;
    if (abs(ddxleft-ddxright) > 10e1) {
      throw new Error("Function is not differentiable at "+str(x));
    }
    return (ddxleft+ddxright)/2;
  }

  public boolean differentiable(float x) {
    try {
      computeDerivative(x);
      return true;
    }
    catch (Error er) {
      return false;
    }
  }

  public void plotTangent(float c) {
    float ddx;
    // Check if derivative exist
    try {
      ddx = computeDerivative(c);
    }
    catch(Error er) {
      new ErrorMessage(er.toString()).display();
      return;
    }
    if (!graphed) {
      new ErrorMessage("Function is not graphed yet").display();
      return;
    }
    String function = ddx+ "*(x-"+c+")+"+f(c);
    if (tangent == null) {
      functions.add(tangent);
    }
    tangent = new Function(function, color(0));
    tangent.graph();
    functions.add(tangent);
  }

  public void deleteTangent() {
    this.tangent = null;
  }

  float[] getPoint(int screenX) {
    int xStart = axis.xStart, xEnd = axis.xEnd, yStart = axis.yStart, yEnd = axis.yEnd;
    float fakeX = map(screenX, 0, width, xStart, xEnd);
    float pointY = map(f(fakeX), yStart, yEnd, 0, height);
    return new float[] {screenX, height - pointY};
  }
  public void graph() {
    for (int i = 0; i <= width; i++) {
      float[] p = getPoint(i);

      point(p[0], p[1]);
      if (i > 0) {
        float[] pp = getPoint(i - 1);
        if (dist(p[0], p[1], pp[0], pp[1]) > 1 && dist(p[0], p[1], pp[0], pp[1]) < height) {
          stroke(this.c);
          line(p[0], p[1], pp[0], pp[1]);
        }
      }
    }

    this.graphed = true;
    if (tangent != null) {
      tangent.graph();
    }
  }
  void destroyGraph() {
    background(bg);
    axis.drawAxis();
    // Redraw every point
    for (Point p : points) {
      p.drawPoint();
    }
    //// Remove this object from functions collection
    //for (Iterator<Function> iterator = functions.iterator(); iterator.hasNext(); ) {
    //  Function f = iterator.next();
    //  if (f.id.equals(this.id)) iterator.remove();
    //}
    for (Iterator<Function> iterator = functions.iterator(); iterator.hasNext(); ) {
      Function f = iterator.next();
      if (!f.id.equals(this.id)) {
        f.graph();
      }
    }
  }
  public void plotRiemann(String mode, float start, float end, int subdivisions) {
    float dx = (float)(end-start)/subdivisions; // Relative to the x-axis and input
    int xStart = axis.xStart, xEnd = axis.xEnd, yStart = axis.yStart, yEnd = axis.yEnd;
    int xScale = width / (xEnd - xStart);
    int yScale = height / (yEnd-yStart);

    float rxStart = map(start, xStart, xEnd, 0, width);

    float xAxisPos;

    if (yStart < 0 && yEnd > 0) {
      xAxisPos = yEnd*yScale;
    } else if (yStart >= 0) {
      xAxisPos = height-10;
    } else {
      xAxisPos = 10;
    }

    float rectWidth = xScale*dx; // Absolute value relative to the window

    noStroke();
    //fill(red(this.c), green(this.c), blue(this.c), 50);
    switch (mode) {
    case "LEFT":
      for (int i = 0; i < subdivisions; i++) {
        float rectHeight = this.compute(start + i*dx)*yScale;
        float rectX = rxStart+rectWidth, rectY = xAxisPos + rectHeight;
        Block rect = new Block(rxStart, xAxisPos-rectHeight, rectWidth, rectHeight, this.id, this.c);
        rect.draw();
        rxStart+=rectWidth;
      }
      break;
    case "RIGHT":
      // Right riemann sum starts with f(i+1);
      for (int i = 1; i <= subdivisions; i++) {
        float rectHeight = this.compute(start + i*dx)*yScale; // Absolute height in pixel unit
        float rectX = rxStart+rectWidth, rectY = xAxisPos + rectHeight;
        Block rect = new Block(rxStart, xAxisPos-rectHeight, rectWidth, rectHeight, this.id, this.c);
        rect.draw();
        rxStart+=rectWidth;
      }
      break;
    case "TRAPEZOIDAL":
      strokeWeight(1);
      for (int i = 0; i < subdivisions; i++) {
        float[] p1 = {rxStart, xAxisPos}; // bottom left corner
        float[] p2 = {rxStart+rectWidth, xAxisPos}; // bottom right corner
        float leftYVal = this.compute(start + i*dx);
        float leftYHeight = leftYVal * yScale;
        float[] p3 = {rxStart, xAxisPos-leftYHeight}; // top left
        float rightYVal = this.compute(start + (i+1)*dx);
        float rightYHeight = rightYVal*yScale;
        float[] p4 ={rxStart+rectWidth, xAxisPos-rightYHeight}; // top right
        Block trap = new Block(p1, p2, p3, p4, this.id, this.c);
        trap.draw();
        rxStart+=rectWidth;
      }

      break;
    case "MIDPOINT":
      for (int i = 0; i < subdivisions; i++) {
        float left = this.compute(start + i*dx)*yScale; // Absolute height in pixel unit
        float right = this.compute(start + (i+1)*dx)*yScale; // Absolute height in pixel unit
        float rectHeight = (left+right)/2;
        float rectX = rxStart+rectWidth, rectY = xAxisPos + rectHeight;
        Block rect = new Block(rxStart, xAxisPos-rectHeight, rectWidth, rectHeight, this.id, this.c);
        rect.draw();
        rxStart+=rectWidth;
      }
      break;
    default:
      return;
      //throw new Error("Invalid riemann sum mode");
    }
  }
}

color getFunctionColor(String funcId) {
  for (Function f : functions) {
    if (f.id.equals(funcId)) {
      return f.c;
    }
  }
  return -1;
}
