class Request {
  String requestId, functionId;
  int start, end;
  int val;
  // For compute
  public Request(String requestId, String functionId, int val) {
    this.requestId = requestId;
    this.functionId = functionId;
    this.val = val;
  }
}
