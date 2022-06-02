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

fs.writeFile('data.txt', '', (err) => {
  if (err) throw err;
});
wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  // const portNum = Number(request.origin.split(':').at(-1));

  clients[request.origin] = connection;

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      const resData = JSON.parse(message.utf8Data);
      // for (key in clients) {
      //   clients[key].sendUTF(message.utf8Data);
      // }
      if (resData.save) {
        if (resData.action === 'PLOT') {
          fs.appendFile(
            'data.txt',
            resData.object + ' ' + resData.data + ' ' + resData.id + '\n',
            (err) => {
              if (err) {
                console.error(err);
              }
            }
          );
        } else if (resData.action === 'DELETE') {
          // Delete resData.data from data.txt
          fs.readFile('data.txt', 'utf8', (err, data) => {
            if (err) throw err;
            const lines = data.split('\n');
            const newData = lines.filter(
              (line) => line.split(' ')[3] !== resData.id
            );
            fs.writeFile('data.txt', newData.join('\n'), (err) => {
              if (err) throw err;
            });
          });
        }
      }
    }
  });
});

wsServer.on('error', (error) => {
  console.error;
});

wsServer.on('connect', (connection) => {
  const data = fs.readFileSync('data.txt', 'utf8', (err, data) => {
    if (err) throw err;
    return data;
  });
  connection.send(JSON.stringify({ data, action: 'LOAD' }));
});

process.on('SIGINT' || 'exit' || 'SIGUSR1' || 'SIGUSR2', () => {
  fs.unlink('data.txt', (err) => {
    process.exit();
  });
});
