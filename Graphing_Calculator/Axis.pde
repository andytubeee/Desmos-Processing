class Axis {
  int xStart, xEnd, yStart, yEnd;
  private int xScaleJump = 1, yScaleJump = 1;

  private Axis() {
  }


  public void setParameters(int xStart, int xEnd, int yStart, int yEnd) {
    this.xStart = xStart;
    this.xEnd = xEnd;
    this.yStart = yStart;
    this.yEnd = yEnd;

    this.drawAxis();
    redraw();
  }
  private boolean validParameters() {
    boolean initalized = !(this.xStart == 0 && this.xEnd == 0 && this.yStart == 0 && this.yEnd == 0);
    boolean balanced = (this.xStart < this.xEnd && this.yStart < this.yEnd);
    return initalized && balanced ;
  }
  public void drawAxis() {
    if (!this.validParameters()) {
      fill(0);
      textSize(30);
      text("Invalid axis!", 10, 30);
      return;
    }

    background(255);
    stroke(0);
    strokeWeight(1);
    drawXAxis();
    drawYAxis();
  }

  public void setXScale(int s) {
    this.xScaleJump = s;
    this.drawAxis();
  }

  public void setYScale(int s) {
    this.yScaleJump = s;
    this.drawAxis();
  }

  private void drawXAxis() {
    int xScale = width / (xEnd - xStart);
    int yScale = height / (yEnd-yStart);

    float textX, textY;


    if (yStart < 0 && yEnd > 0) {
      line(0, yEnd*yScale, width, yEnd*yScale);
      textX = 0;
      textY = yEnd * yScale + 10;
    } else if (yStart >= 0) {
      // Axis on the bottom
      line(0, height-10, width, height-10);
      textX = 0;
      textY = height-5;
    } else {
      // Axis on the top
      line(0, 10, width, 10);
      textX = 0;
      textY = 5;
    }
    fill(80);

    for (int i = xStart; i <= xEnd; i+=xScaleJump) {
      text(i, textX, textY);
      if (i == xEnd-1)
        textX += xScale * xScaleJump - (0.1 * xScale);
      else
        textX += xScale * xScaleJump;
    }
  }
  private void drawYAxis() {
    int xScale = width / (xEnd - xStart);
    int yScale = height / (yEnd-yStart);

    float textX, textY;
    if (xStart < 0 && xEnd > 0) {
      line(abs(xStart)*xScale, 0, abs(xStart)*xScale, height);
      textX = abs(xStart)*xScale-10;
      textY = height;
    } else if (xStart >= 0) {
      // Axis on the left side
      line(10, 0, 10, height);
      textX = 15;
      textY = height - 10;
    } else {
      // Axis on the right side
      line(width-10, 0, width-10, height);
      textX = width-15;
      textY = height - 10;
    }
    fill(80);

    for (int i = yStart; i <= yEnd; i+=yScaleJump) {
      textX = abs(xStart)*xScale-10;

      if (str(i).length() >= 3) {
        textX -= 10;
      }
      text(i, textX, textY);

      if (i == yEnd-1)
        textY -= yScale * yScaleJump - (0.05 * yScale);
      else
        textY -= yScale * yScaleJump;
    }
  }
  public void moveDown() {
    int yScale = height / (yEnd-yStart);

    yStart += 1;
    yEnd += 1;
    drawAxis();
    moveAllRSBlock("DOWN", yScale);

    redraw();
  }
  public void moveUp() {
    int yScale = height / (yEnd-yStart);

    yStart -= 1;
    yEnd -= 1;
    drawAxis();
    moveAllRSBlock("UP", yScale);

    redraw();
  }

  public void moveLeft() {
    int xScale = width / (xEnd - xStart);

    xStart -= 1;
    xEnd -= 1;

    drawAxis();
    moveAllRSBlock("LEFT", xScale);

    redraw();
  }

  public void moveRight() {
    int xScale = width / (xEnd - xStart);

    xStart += 1;
    xEnd += 1;
    drawAxis();
    moveAllRSBlock("RIGHT", xScale);

    redraw();
  }

  public void zoomIn() {
    if (xEnd - xStart > 2) {
      xStart += xScaleJump;
      xEnd -= xScaleJump;
    }
    if (yEnd - yStart > 2) {
      yStart += yScaleJump;
      yEnd -= yScaleJump;
    }

    drawAxis();
    redraw();
  }
  public void zoomOut() {
    xStart -= xScaleJump;
    xEnd += xScaleJump;
    yStart -= yScaleJump;
    yEnd += yScaleJump;
    drawAxis();
    redraw();
  }
}
