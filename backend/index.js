const port = 8000;
const websocketServer = require('websocket').server;
const http = require('http');
const fs = require('fs');

const server = http.createServer();
const clients = {};
server.listen(port);
console.log('listening on port 8000');

const wsServer = new websocketServer({
  httpServer: server,
});

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);

  clients[request.origin || 'PROCESSING'] = connection;

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log(message.utf8Data);
      for (key in clients) {
        clients[key].sendUTF(message.utf8Data);
      }
    }
  });
});

wsServer.on('error', (error) => {
  console.log('Error: ' + error);
});

wsServer.on('connect', (connection) => {
  connection.send('Welcome');
});
