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
    String function = ddx+ "*(" +"x-"+c+")+"+f(c);
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
    int xStart = axis.xStart, xEnd =axis.xEnd, yStart = axis.yStart, yEnd = axis.yEnd;
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
}
