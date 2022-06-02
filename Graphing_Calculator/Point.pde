public void drawAllPoints() {
  for (Point p : points) {
    p.drawPoint();
  }
}

class Point {
  float x, y;
  private float screenX, screenY; 
  private int xStart = axis.xStart, xEnd = axis.xEnd, yStart =axis.yStart, yEnd = axis.yEnd;
  public String id;
  boolean drawn = false;
  public Point(float x, float y, String id) {
    this.x = x;
    this.y = y;
    this.id = id;

    this.screenX = map(x, xStart, xEnd, 0, width);
    this.screenY = map(y, yStart, yEnd, 0, height);
  }
  public void drawPoint() {
    fill(0);
    noStroke();
    circle(screenX, height - screenY, 5);

    drawn = true;
  }
  public void undraw() {
    
    drawn = false;
    fill(bg);
    noStroke();
    circle(screenX, height - screenY, 6);
  }
}
