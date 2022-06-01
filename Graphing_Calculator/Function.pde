class Function {
  String function;
  color c;
  private color[] hexcodes = new color[] {#32a852, #20e8ca, #592ff5, #fa0a4a, #f5f0f1};

  public Function(String func, color c) {
    this.function = func;
    this.c = c;
  }
  public Function(String func) {
    this.function = func;
  }
  private color useColour() {
    return this.c == 0 ? hexcodes[(int)random(hexcodes.length-1)] : c;
  }
  float f(float x) {
    Expression e = new ExpressionBuilder(function)
      .variables("x")
      .build()
      .setVariable("x", x);
    return(float)e.evaluate();
  }
  float[] getPoint(int screenX) {
    int xStart = axis.xStart, xEnd =axis.xEnd, yStart = axis.yStart, yEnd = axis.yEnd;
    float fakeX = map(screenX, 0, width, xStart, xEnd);
    float pointY = map(f(fakeX), yStart, yEnd, 0, height);
    return new float[] {screenX, height - pointY};
  }
  void graph() {
    color c = useColour();
    for (int i = 0; i <= width; i++) {
      float[] p = getPoint(i);
      point(p[0], p[1]);
      if (i > 0) {
        float[] pp = getPoint(i - 1);
        if (dist(p[0], p[1], pp[0], pp[1]) > 1) {
          stroke(c);
          line(p[0], p[1], pp[0], pp[1]);
        }
      }
    }
  }
  void destroyGraph() {
  }
}
