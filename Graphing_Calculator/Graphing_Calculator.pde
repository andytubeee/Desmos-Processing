import net.objecthunter.exp4j.*;
import java.io.*;
import java.net.*;
import java.lang.reflect.Type;
import java.util.*;
import com.google.gson.*;
import websockets.*;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;


// Modifiable parameter
final boolean debugMode = false;
final boolean readData = true;

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
  Function[] nullFunctions;
  Point[] nullPoints;
  size(800, 800);
  background(bg);
  if (debugMode) {
    connected = true; // Assume connected for debug mode.
    axis.setParameters(-10, 10, -10, 10);
    axis.drawAxis();

    //noLoop(); // No data will be dynamically loaded, turn off looping for performace. EDIT: cannot call noLoop() in order to use keyPressed()

    if (readData) {
      // Reading file from saved data.
      String savedFuncs = String.join(" ", loadStrings("../frontend/data/functions.json"));
      String savedPoints = String.join(" ", loadStrings("../frontend/data/points.json"));

      savedFuncs = fixFunctionString(savedFuncs);

      nullFunctions = gson.fromJson(savedFuncs, Function[].class);
      nullPoints = gson.fromJson(savedPoints, Point[].class);
      loadData(nullFunctions, nullPoints);
    } else {
      // Create your own function / points & calculations here


      // Initalize a test function
      Function f = new Function("x^2", "testFunc");
      f.graph();
      functions.add(f);

      f.plotRiemann("TRAPEZOIDAL", -3, 3, 4);
    }
    return;
  }
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

    nullPoints = gson.fromJson(dataObj.get("points").toString(), Point[].class);
    String functionsStringfied = dataObj.get("functions").toString().replace(" ", "");
    nullFunctions = gson.fromJson(functionsStringfied, Function[].class);
    loadData(nullFunctions, nullPoints);
  }
}

void loadData(Function[] funcArr, Point[] pointsArr) {
  // Note: funcArr and pointsArr contains null object with just primative values. We need perform a deep copy of objects

  // Recreate functions arraylist
  for (Function f : funcArr) {
    Function f_nl = new Function(f.function, f.id);
    f_nl.graph();
    functions.add(f_nl);
  }

  // Recreate points arraylist
  for (Point p : pointsArr) {
    Point p_not_null = new Point(p.x, p.y, p.id);
    p_not_null.drawPoint();
    points.add(p_not_null);
  }
}

void webSocketEvent(String msg) {
  try {
    Map<String, Object> dataObj = new HashMap<String, Object>();
    dataObj = (Map<String, Object>) gson.fromJson(msg, dataObj.getClass());
    String action = dataObj.get("action").toString();
    onCommand.fire(action);
  }
  catch(Exception er) {
    println("Incorrect JSON request:", msg);
  }
}

String fixFunctionString(String s) {
  return s.replace(" ", "").replace("^", "").replace("=", "");
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
  } else if (key == 't') {
    // Used to test various functions during development.
    if (debugMode)
      undrawRSBlocks("testFunc");
  }
}

void clearScreen() {
  background(bg);
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
  axis.drawAxis();

  // Redraw every point
  for (Point p : points) {
    p.drawPoint();
  }

  // Redraw every function
  for (Function f : functions) {
    f.graph();
  }

  // Redraw every block
  redrawAllRSBlocks();
}

void draw() {
  if (!connected) return;
  if (debugMode) return;
  try {
    String[] fetchRes = loadStrings("http://localhost:"+webappPort+"/api/fetch");
    // Parse response string to a JSON object
    Map<String, Object> dataObj = new HashMap<String, Object>();
    dataObj = (Map<String, Object>) gson.fromJson(fetchRes[0], dataObj.getClass());

    Point[] incomingPoints = gson.fromJson(dataObj.get("points").toString(), Point[].class);
    Function[] incomingFunctions = gson.fromJson(dataObj.get("functions").toString().replace(" ", ""), Function[].class);

    /* Handle points */

    // Recreate point object and store them globally
    for (Point p : incomingPoints) {
      Point pnl = new Point(p.x, p.y, p.id);
      if (!pointInPoints(pnl)) {
        pnl.drawPoint();
        points.add(pnl);
      }
    }

    // Deleting points from existing points arraylist if deleted on the backend.
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
    /* Handle functions */

    // Recreate function array by adding new functions to the functions arraylist
    for (Function f : incomingFunctions) {
      Function fnl = new Function(f.function, f.id);
      if (!funcInFunctions(fnl)) {
        functions.add(fnl);
        fnl.graph();
      }
    }
    // Deleting existing functions if deleted on the backend
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
  catch (Exception ex) {
  }

  // Websocket event listener
  if (onCommand.fired()) {
    // Get the data attached with the event
    String eventData = onCommand.data.pop();

    if (eventData.equals("ZOOMIN"))
      axis.zoomIn();
    else if (eventData.equals("ZOOMOUT"))
      axis.zoomOut();
    else {
      String[] commands = eventData.split(" ");
      String masterCmd = commands[0];
      if (masterCmd.equals("AXIS")) {
        // Change axis parameters
        int xStart = int(commands[1]), xEnd = int(commands[2]), yStart = int(commands[3]), yEnd = int(commands[4]);
        axis.setParameters(xStart, xEnd, yStart, yEnd);
      } else if (masterCmd.equals("RIEMANN")) {
        // Plot riemann sum blocks under the function
        String funcId = commands[1];
        String type = commands[2];
        float start = Float.valueOf(commands[3]), end = Float.valueOf(commands[4]);
        int subdivisions = int(commands[5]);
        for (Function f : functions) {
          if (f.id.equals(funcId)) {
            f.plotRiemann(type, start, end, subdivisions);
            break;
          }
        }
      } else if (masterCmd.equals("DELETERIEMANN")) {
        String funcId = commands[1];
        undrawRSBlocks(funcId);
      }
    }

    onCommand.finishEvent();
  }
}
