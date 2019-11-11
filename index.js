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
wss.on('connection', (ws) => {
  openConnectionToFeatureProcessing();
});

//start our server
server.listen(port, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

function openConnectionToFeatureProcessing() {
  wsClient.close();
  wsClient = new WebSocket(
    'ws://webtask.future-processing.com:8068/ws/currencies',
  );
  wsClient.on('message', (data) => {
    brodcastMessage(data);
  });
}
function brodcastMessage(data) {
  wss.clients.forEach((client) => client.send(data));
}
