const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const port = process.env.PORT || 3000;
const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance

const wss = new WebSocket.Server({ server });
var wsClient;
var externalConnection = false;
wss.on('connection', (ws) => {
  if (!externalConnection) {
    openConnectionToFeatureProcessing();
  }
});

//start our server
server.listen(port, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

function openConnectionToFeatureProcessing() {
  wsClient = new WebSocket(
    'ws://webtask.future-processing.com:8068/ws/currencies',
  );

  wsClient.on('open', (ws) => (externalConnection = true));
  wsClient.on('close', (ws) => (externalConnection = false));
  wsClient.on('error', (ws) => (externalConnection = false));
  wsClient.on('message', (data) => {
    brodcastMessage(data);
  });
}
function brodcastMessage(data) {
  console.log(
    JSON.parse(data).PublicationDate + 'active clients ' + wss.clients.size,
  );
  if (!wss.clients.size) {
    wsClient.close();
  } else {
    wss.clients.forEach((client) => client.send(data));
  }
}
