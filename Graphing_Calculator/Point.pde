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
    //addPointToCollection(); // Causes bug
    updateAxisInfo();
  }

  private void addPointToCollection() {
    for (Point p : points) {
      if (p.id.equals(this.id)) return;
    }
    points.add(this);
  }

  private void updateAxisInfo() {
    this.xStart = axis.xStart;
    this.xEnd = axis.xEnd;
    this.yStart =axis.yStart;
    this.yEnd = axis.yEnd;

    this.screenX = map(x, xStart, xEnd, 0, width);
    this.screenY = map(y, yStart, yEnd, 0, height);
  }

  public void drawPoint() {
    updateAxisInfo();
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

    //for (Iterator<Point> iterator = points.iterator(); iterator.hasNext();) {
    //Point p = iterator.next();
    //if(p.id.equals(this.id)) {
    //    iterator.remove();
    //}
    //}
  }
  public boolean equals(Point p) {
    return this.id.equals(p.id);
  }
}
