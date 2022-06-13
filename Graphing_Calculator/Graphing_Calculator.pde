import net.objecthunter.exp4j.*;
import java.io.*;
import java.net.*;
import java.util.*;
import com.google.gson.*;
import websockets.*;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

WebsocketClient wsc;


Axis axis = new Axis();
Gson gson = new Gson();

Event onCommand = new Event();

ArrayList<Point> points = new ArrayList<Point>();
ArrayList<Function> functions = new ArrayList<Function>();

final int websocketPort = 8000, webappPort = 3000;

final color bg = 255;
boolean connected = false;

void setup() {
  size(800, 800);
  background(bg);
  if (!portAvailable(websocketPort)) {
    new ErrorMessage("Websocket connection not running").display();
  } else if (!portAvailable(webappPort)) {
    new ErrorMessage("Web application not running").display();
  } else {
    wsc = new WebsocketClient(this, "ws://localhost:8000");
    connected = true;
    axis.setParameters(-10, 10, -10, 10);
    axis.drawAxis();
    // Fetch from API
    String fetchRes = loadStrings("http://localhost:"+webappPort+"/api/fetch")[0];
    // Parse response string to a JSON object
    Map<String, Object> dataObj = new HashMap<String, Object>();
    dataObj = (Map<String, Object>) gson.fromJson(fetchRes, dataObj.getClass());

    Point[] existingPoints = gson.fromJson(dataObj.get("points").toString(), Point[].class);
    for (Point p : existingPoints) {
      Point p_not_null = new Point(p.x, p.y, p.id);
      p_not_null.drawPoint();
      points.add(p_not_null);
    }
    Function[] existingFunctions = gson.fromJson(dataObj.get("functions").toString(), Function[].class);
    for (Function f : existingFunctions) {
      Function f_nl = new Function(f.function, f.id);
      f_nl.graph();
      functions.add(f_nl);
    }
  }
}

void webSocketEvent(String msg) {
  try {
    Map<String, Object> dataObj = new HashMap<String, Object>();
    dataObj = (Map<String, Object>) gson.fromJson(msg, dataObj.getClass());
    String action = dataObj.get("action").toString();
    onCommand.fire(action);
  }
  catch(IllegalStateException er) {
    println("Incorrect JSON request");
  }
}

public static boolean portAvailable(int portNum) {
  boolean portFree;
  ServerSocket ignored;

  try {
    ignored = new ServerSocket(portNum);
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
  //for (Function f : functions) {
  //  f.graph();
  //}
}

void clearScreen() {
  background(100);
}

boolean pointInPoints(Point p) {
  for (Point p_c : points) {
    if (p_c.id.equals(p.id)) return true;
  }
  return false;
}
boolean funcInFunctions(Function f) {
  for (Function f_c : functions) {
    if (f_c.id.equals(f.id)) return true;
  }
  return false;
}

void redraw() {
  // Redraw every point
  for (Point p : points) {
    p.drawPoint();
  }

  // Redraw every function
  for (Function f : functions) {
    f.graph();
  }
}

void draw() {
  if (!connected) return;
  try {
    String[] fetchRes = loadStrings("http://localhost:"+webappPort+"/api/fetch");
    // Parse response string to a JSON object
    Map<String, Object> dataObj = new HashMap<String, Object>();
    dataObj = (Map<String, Object>) gson.fromJson(fetchRes[0], dataObj.getClass());

    Point[] incomingPoints = gson.fromJson(dataObj.get("points").toString(), Point[].class);
    Function[] incomingFunctions = gson.fromJson(dataObj.get("functions").toString(), Function[].class);

    // Handle points
    for (Point p : incomingPoints) {
      Point pnl = new Point(p.x, p.y, p.id);
      if (!pointInPoints(pnl)) {
        pnl.drawPoint();
        points.add(pnl);
      }
    }

    for (Iterator<Point> iterator = points.iterator(); iterator.hasNext(); ) {
      Point p = iterator.next();
      boolean exists = false;
      for (Point p_c : incomingPoints) {
        if (p.id.equals(p_c.id)) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        p.undraw();
        iterator.remove();
      }
    }
    // Handle functions
    for (Function f : incomingFunctions) {
      Function fnl = new Function(f.function, f.id);
      if (!funcInFunctions(fnl)) {
        functions.add(fnl);
        fnl.graph();
      }
    }

    for (Iterator<Function> iterator = functions.iterator(); iterator.hasNext(); ) {
      Function f = iterator.next();
      boolean exists = false;
      for (Function fc : incomingFunctions) {
        if (fc.id.equals(f.id)) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        f.destroyGraph();
        iterator.remove();
      }
    }
  }
  catch (NullPointerException er) {
  }

  if (onCommand.fired()) {
    String eventData = onCommand.data.pop();

    if (eventData.equals("ZOOMIN"))
      axis.zoomIn();
    else if (eventData.equals("ZOOMOUT"))
      axis.zoomOut();
    else {
      String[] commands = eventData.split(" ");
      int xStart = int(commands[1]), xEnd = int(commands[2]), yStart = int(commands[3]), yEnd = int(commands[4]);
      axis.setParameters(xStart, xEnd, yStart, yEnd);
    }


    onCommand.finishEvent();
  }
}

//if (onCommand.fired()) {
//  if (onCommand.data.size() > 0) {
//    String data = onCommand.data.firstElement();
//    println(data);
//    Gson gson = new Gson();
//    Map<String, Object> dataObj = new HashMap<String, Object>();
//    dataObj = (Map<String, Object>) gson.fromJson(data, dataObj.getClass());
//    String action = dataObj.get("action").toString();
//    println(data);
//    if (action.equals("ZOOMIN")) {
//      axis.zoomIn();
//    } else if (action.equals("ZOOMOUT")) {
//      axis.zoomOut();
//    } else if (action.equals("PLOT")) {
//      String object = dataObj.get("object").toString();
//      switch(object) {
//      case "POINT":
//        String actionData = dataObj.get("data").toString();
//        float xVal = Float.parseFloat(actionData.split(" ")[0]);
//        float yVal = Float.parseFloat(actionData.split(" ")[1]);
//        String id = dataObj.get("id").toString();
//        Point p = new Point(xVal, yVal, id);
//        p.drawPoint();
//        break;
//      }
//    } else if (action.equals("DELETE")) {
//      String id = dataObj.get("id").toString();
//      for (Point p : points) {
//        if (p.id.equals(id) && p.drawn == true) {
//          p.undraw();
//        }
//      }
//    }
//  }
//  onCommand.data.pop();
//  onCommand.finishEvent();
//}
