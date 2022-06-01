class ErrorMessage {
  String msg;

  public ErrorMessage(String msg) {
    this.msg = msg;
  }
  public void display() {
    fill(255, 0, 0);
    textSize(30);
    text(msg, 0, height/2);
  }
}
