const port = 8000;
const websocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
const clients = {};
server.listen(port);
console.log('listening on port 8000');

const wsServer = new websocketServer({
  httpServer: server,
});

wsServer.on('request', (request) => {
  console.log(
    new Date() +
      ' received a new connection from origin ' +
      request.origin +
      '.'
  );
  const connection = request.accept(null, request.origin);
  clients[Object.keys(clients).length] = connection;
  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log(message.utf8Data);
      for (key in clients) {
        clients[key].sendUTF(message.utf8Data);
        console.log('Sent message to: ', clients[key]);
      }
    }
  });
});

wsServer.on('error', (error) => {
  console.error;
});
