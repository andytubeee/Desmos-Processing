class Event {
  private boolean fired = false;
  private int numsFired = 0;
  public Stack<String> data = new Stack<String>();
  public Event() {}

  public void fire() {
    if (!this.fired) this.fired = true;
  }

  public boolean fired() {
    return this.fired;
  }

  public void finishEvent() {
    this.fired = false;
    numsFired++;
  }

}
