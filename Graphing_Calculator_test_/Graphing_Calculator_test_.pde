import g4p_controls.*;
import net.objecthunter.exp4j.*;
import websockets.*;
import java.io.*;
import java.net.*;
import java.util.*;

WebsocketClient wsc;

Event onUpdateSettings = new Event(), onClear = new Event(), onCommand = new Event();

boolean verifyConnection = false;

void setup() {
  size(800, 800, JAVA2D);
  //createGUI();
  axis = getAxis();
  axis.drawAxis();
  drawFunc();
  if (!isAvailable(8000)) {
    println("Websocket connection not running");
    exit();
  } else if (!isAvailable(3000)) {
    println("Backend web app not running");
    exit();
  }

  wsc = new WebsocketClient(this, "ws://localhost:8000");

}

void webSocketEvent(String msg) {
  //JSONObject obj = new JSONObject(msg);
  onCommand.data.push(msg);
  onCommand.fire();
}

public static boolean isAvailable(int portNr) {
  boolean portFree;
  try {
    ServerSocket ignored = new ServerSocket(portNr);
    portFree = false;
  } 
  catch (IOException e) {
    portFree = true;
  }
  return portFree;
}


float f(String func, float x) {
  Expression e = new ExpressionBuilder(func)
    .variables("x")
    .build()
    .setVariable("x", x);
  return (float)e.evaluate();
}

float[] getPoint(int screenX) {
  int xStart = axis.xStart, xEnd = axis.xEnd, yStart = axis.yStart, yEnd = axis.yEnd;
  float fakeX = map(screenX, 0, width, xStart, xEnd);
  float pointY = map(f("sin(x)x^3", fakeX), yStart, yEnd, 0, height);
  return new float[] {screenX, height-pointY};
}

void drawFunc() {
  for (int i = 0; i <= width; i++) {
    float[] p = getPoint(i);
    point(p[0], p[1]);
    if (i > 0) {
      float[] pp = getPoint(i-1);
      if (dist(p[0], p[1], pp[0], pp[1]) > 1) {
        stroke(0, 255, 0);
        line(p[0], p[1], pp[0], pp[1]);
      }
    }
  }
}

void plotPoint(float x, float y) {
  int xStart = axis.xStart, xEnd = axis.xEnd, yStart = axis.yStart, yEnd = axis.yEnd;
  float fakeX = map(x, xStart, xEnd, 0, width);
  float fakeY = map(y, yStart, yEnd, 0, height);
  fill(255);
  noStroke();
  circle(fakeX, height-fakeY, 5);
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    axis.moveDown();
  } else if (key == 'w' || key == 'W') {
    axis.moveUp();
  } else if (key == 'a' || key == 'A') {
    axis.moveLeft();
  } else if (key == 'd' || key == 'D') {
    axis.moveRight();
  } else if (key == 'z' || key == 'Z') {
    axis.zoomIn();
  } else if (key == 'x' || key == 'X') {
    axis.zoomOut();
  } 
  drawFunc();
}

void clearScreen() {
  background(100);
}

void draw() {

  if (onUpdateSettings.fired()) {
    axis.setXScale(xAxisSlider.getValueI());
    axis.setYScale(yAxisSlider.getValueI());
    onUpdateSettings.finishEvent();
  }

  if (onClear.fired()) {
    clearScreen();
    axis.drawAxis();
    onClear.finishEvent();
  }

  if (onCommand.fired()) {
    if (onCommand.data.size() > 0) {
      String data = onCommand.data.firstElement();
      if (data.equals("ZOOMIN")) {
        axis.zoomIn();
        drawFunc();
      } else if (data.equals("ZOOMOUT")) {
        axis.zoomOut();
        drawFunc();
      } else {

        String headCommand = data.toString().split(" ")[0];
        switch (headCommand) {
        case "POINT":
          float xVal = Float.parseFloat(data.split(" ")[0]);
          float yVal = Float.parseFloat(data.split(" ")[1]);
          
          break;
        }
      }
      onCommand.data.pop();
    }
    //println(onCommand.data.size());
    onCommand.finishEvent();
  }
}
