import g4p_controls.*;
import net.objecthunter.exp4j.*;
import websockets.*;
import java.io.*;
import java.net.*;
import java.util.*;

WebsocketClient wsc;
Axis axis = new Axis();

Event onCommand = new Event();

boolean verifyConnection = false;

ArrayList<Point> points = new ArrayList<Point>();
ArrayList<Function> functions = new ArrayList<Function>();

final int websocketPort = 8000, webappPort = 3000;

void setup() {
  size(800, 800, JAVA2D);


  if (!isAvailable(websocketPort)) {
     new ErrorMessage("Websocket connection not running").display();
  } else if (!isAvailable(webappPort)) {
    new ErrorMessage("Web application not running").display();
  } else {
    wsc = new WebsocketClient(this, "ws://localhost:8000");
    axis.setParameters(-10, 10, -10, 10);
    axis.drawAxis();
  }

  //functions.add(new Function("3sin(x)", color(0,0,0)));
  //functions.add(new Function("2sin(x^2)", color(125,255,1)));

  //functions.get(0).graph();
  //functions.get(1).graph();
}

void webSocketEvent(String msg) {
  onCommand.data.push(msg);
  onCommand.fire();
}

public static boolean isAvailable(int portNr) {
  boolean portFree;
  try {
    ServerSocket ignored = new ServerSocket(portNr);
    portFree = false;
  } 
  catch(IOException e) {
    portFree = true;
  }
  return portFree;
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
}

void clearScreen() {
  background(100);
}

void regraphFunction() {
  for (Function f : functions) {
    f.graph();
  }
}

void draw() {

  if (onCommand.fired()) {
    if (onCommand.data.size() > 0) {
      String data = onCommand.data.firstElement();
      if (data.equals("ZOOMIN")) {
        axis.zoomIn();
      } else if (data.equals("ZOOMOUT")) {
        axis.zoomOut();
      } else {

        String headCommand = data.toString().split(" ")[0];
        switch(headCommand) {
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
