import net.objecthunter.exp4j.*;
import java.io.*;
import java.net.*;
import java.util.*;
import com.google.gson.*;
import websockets.*;
WebsocketClient wsc;


Axis axis = new Axis();
Gson gson = new Gson();

Event onCommand = new Event();

ArrayList<Point> points = new ArrayList<Point>();
ArrayList<Function> functions = new ArrayList<Function>();

final int websocketPort = 8000, webappPort = 3000;

final color bg = 255;

void setup() {
  size(800, 800);
  background(bg);

  if (!portAvailable(websocketPort)) {
    new ErrorMessage("Websocket connection not running").display();
  } else if (!portAvailable(webappPort)) {
    new ErrorMessage("Web application not running").display();
  } else {
    wsc = new WebsocketClient(this, "ws://localhost:8000");

    axis.setParameters(-10, 10, -10, 10);
    axis.drawAxis();
    // Fetch from API
    String[] fetchRes = loadStrings("http://localhost:"+webappPort+"/api/fetch");
    // Parse response string to a JSON object
    Map<String, Object> dataObj = new HashMap<String, Object>();
    dataObj = (Map<String, Object>) gson.fromJson(fetchRes[0], dataObj.getClass());

    Point[] existingPoints = gson.fromJson(dataObj.get("points").toString(), Point[].class);
    for (Point p : existingPoints) {
      Point p_not_null = new Point(p.x, p.y, p.id);
      points.add(p_not_null);
      p_not_null.drawPoint();
    }
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
  for (Function f : functions) {
    f.graph();
  }
  wsc.sendMessage("Hello");
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

void draw() {
  String[] fetchRes = loadStrings("http://localhost:"+webappPort+"/api/fetch");
  // Parse response string to a JSON object
  Map<String, Object> dataObj = new HashMap<String, Object>();
  dataObj = (Map<String, Object>) gson.fromJson(fetchRes[0], dataObj.getClass());

  Point[] incomingPoints = gson.fromJson(dataObj.get("points").toString(), Point[].class);

  for (Point p : incomingPoints) {
    Point pnl = new Point(p.x, p.y, p.id);
    if (!pointInPoints(pnl)) {
      pnl.drawPoint();
      points.add(pnl);
    }
  }

  for (Iterator<Point> iterator = points.iterator(); iterator.hasNext();) {
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
  //        points.add(p);
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
}
