import net.objecthunter.exp4j.*;
import websockets.*;
import java.io.*;
import java.net.*;
import java.util.*;
import com.google.gson.*;


WebsocketClient wsc;
Axis axis = new Axis();

Event onCommand = new Event();

boolean verifyConnection = false;

ArrayList<Point> points = new ArrayList<Point>();
ArrayList<Function> functions = new ArrayList<Function>();

final int websocketPort = 8000, webappPort = 3000;

final color bg = 255;

void setup() {
  size(800, 800, JAVA2D);
  background(bg);

  if (!isAvailable(websocketPort)) {
    new ErrorMessage("Websocket connection not running").display();
  } else if (!isAvailable(webappPort)) {
    new ErrorMessage("Web application not running").display();
  } else {
    wsc = new WebsocketClient(this, "ws://localhost:8000");
    axis.setParameters(-10, 10, -10, 10);
    axis.drawAxis();
  }
  Function f = new Function("sin(1/x)");
}

void webSocketEvent(String msg) {
  Gson gson = new Gson(); 
  Map<String, Object> dataObj = new HashMap<String, Object>();
  dataObj = (Map<String, Object>) gson.fromJson(msg, dataObj.getClass());
  if (dataObj.get("action").equals("LOAD")) {
    // Load data
    String[] programData = dataObj.get("data").toString().split("\n");
    for (String data : programData) {
      String[] parts = data.split(" ");
      String object = parts[0];
      if (object.equals("POINT")) {
        Float x = Float.parseFloat(parts[1]);
        Float y = Float.parseFloat(parts[2]);
        String id = parts[3];
        Point p = new Point(x, y, id);
        p.drawPoint();
        points.add(p);
      }
    }
  } else {
    onCommand.data.push(msg);
    onCommand.fire();
  }
}

public static boolean isAvailable(int portNr) {
  boolean portFree;
  ServerSocket ignored;

  try {
    ignored = new ServerSocket(portNr);
    portFree = false;
    ignored.close();
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
  for (Function f : functions) {
    f.graph();
  }
}

void clearScreen() {
  background(100);
}


void draw() {
  if (onCommand.fired()) {
    if (onCommand.data.size() > 0) {
      String data = onCommand.data.firstElement();
      println(data);
      Gson gson = new Gson(); 
      Map<String, Object> dataObj = new HashMap<String, Object>();
      dataObj = (Map<String, Object>) gson.fromJson(data, dataObj.getClass());
      String action = dataObj.get("action").toString();
      println(data);
      if (action.equals("ZOOMIN")) {
        axis.zoomIn();
      } else if (action.equals("ZOOMOUT")) {
        axis.zoomOut();
      } else if (action.equals("PLOT")) {
        String object = dataObj.get("object").toString();
        switch(object) {
        case "POINT":
          String actionData = dataObj.get("data").toString();
          float xVal = Float.parseFloat(actionData.split(" ")[0]);
          float yVal = Float.parseFloat(actionData.split(" ")[1]);
          String id = dataObj.get("id").toString();
          Point p = new Point(xVal, yVal, id);
          p.drawPoint();
          points.add(p);
          break;
        }
      } else if (action.equals("DELETE")) {
        String id = dataObj.get("id").toString();
        for (Point p : points) {
          if (p.id.equals(id) && p.drawn == true) {
            p.undraw();
          }
        }
      }
    }
    onCommand.data.pop();
  }
  //println(onCommand.data.size());
  onCommand.finishEvent();
}
