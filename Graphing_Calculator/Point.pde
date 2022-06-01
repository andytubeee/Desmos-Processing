class Point {
  float x, y;
  double id;
  public Point(float x, float y, double id) {
    this.x = x;
    this.y = y;
    this.id = id;
  }
  public void drawPoint() {
    int xStart = axis.xStart, xEnd = axis.xEnd, yStart =axis.yStart, yEnd = axis.yEnd;
    float fakeX = map(x, xStart, xEnd, 0, width);
    float fakeY = map(y, yStart, yEnd, 0, height);
    fill(255);
    noStroke();
    circle(fakeX, height - fakeY, 5);
  }
}
