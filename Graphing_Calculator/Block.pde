HashMap<String, ArrayList<Block>> allRSBlocks = new HashMap<String, ArrayList<Block>>();

final String RECT = "rect";
final String TRAP = "trap";

class Block {
  public float x, y, w, h;
  public String funcId;
  public color c;
  private String type;
  public float[] p1, p2, p3, p4;
  public Block(float x, float y, float w, float h, String funcId, color c) {
    // Rectangle
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.funcId=funcId;
    this.c = c;
    this.type = RECT;
    ArrayList<Block> curFuncBlocks = allRSBlocks.getOrDefault(funcId, new ArrayList<Block>());
    curFuncBlocks.add(this);
    allRSBlocks.put(funcId, curFuncBlocks);
  };

  public Block(float[] p1, float[] p2, float[] p3, float[] p4, String funcId, color c) {
    this.p1=p1;
    this.p2=p2;
    this.p3=p3;
    this.p4=p4;
    this.funcId=funcId;
    this.c = c;
    this.type = TRAP;
    ArrayList<Block> curFuncBlocks = allRSBlocks.getOrDefault(funcId, new ArrayList<Block>());
    curFuncBlocks.add(this);
    allRSBlocks.put(funcId, curFuncBlocks);
  }

  public void draw() {
    fill(red(this.c), green(this.c), blue(this.c), 50);
    noStroke();
    if (this.type.equals(RECT)) {
      rect(this.x, this.y, this.w, this.h);
    } else if (this.type.equals(TRAP)) {
      beginShape();
      vertex(p2[0], p2[1]);
      vertex(p1[0], p1[1]);
      vertex(p3[0], p3[1]);
      vertex(p4[0], p4[1]);
      endShape();
    } else {
      throw new Error("Wrong shape!");
    }
  }
}

void undrawRSBlocks(String funcId) {
  background(bg);
  redraw();
  allRSBlocks.remove(funcId);
}

void redrawAllRSBlocks() {
  for (ArrayList<Block> bArr : allRSBlocks.values()) {
    for (Block b : bArr) {
      b.draw();
    }
  }
}

void moveAllRSBlock(String dir, float p) {
  // Move every riemann sum rectangles at a direction a pixel amount relative to the axis
  switch (dir) {
  case "UP":
    for (ArrayList<Block> rectArr : allRSBlocks.values()) {
      println("Going up");
      for (Block r : rectArr) {
        if (r.type.equals(RECT))
          r.y -= p;
        else {
          // Move every point of the shape vertex up
          r.p1[1] -= p;
          r.p2[1] -= p;
          r.p3[1] -= p;
          r.p4[1] -= p;
        }
      }
    }
    break;
  case "DOWN":
    for (ArrayList<Block> rectArr : allRSBlocks.values()) {
      for (Block r : rectArr) {
        if (r.type.equals(RECT))
          r.y += p;
        else {
          // Move every point of the shape vertex down

          r.p1[1] += p;
          r.p2[1] += p;
          r.p3[1] += p;
          r.p4[1] += p;
        }
      }
    }
    break;
  case "LEFT":
    for (ArrayList<Block> rectArr : allRSBlocks.values()) {
      for (Block r : rectArr) {
        if (r.type.equals(RECT))
          r.x += p; // Plane moving to the left, function moving to the right
        else {
          // Move every point of the shape vertex right
          r.p1[0] += p;
          r.p2[0] += p;
          r.p3[0] += p;
          r.p4[0] += p;
        }
      }
    }
    break;
  case "RIGHT":
    for (ArrayList<Block> rectArr : allRSBlocks.values()) {
      for (Block r : rectArr) {
        if (r.type.equals(RECT))
          r.x -= p; // Plane moving to the left, function moving to the left
        else {
          // Move every point of the shape vertex left
          r.p1[0] -= p;
          r.p2[0] -= p;
          r.p3[0] -= p;
          r.p4[0] -= p;
        }
      }
    }
    break;
  default:
    break;
  }
}
