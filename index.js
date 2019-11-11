const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('connection ');
  openConnectionToFeatureProcessing();
});

//start our server
server.listen(3000, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

let wsClient;
function openConnectionToFeatureProcessing() {
  console.log('connect to FP');
  const websocketClient = new WebSocket(
    'ws://webtask.future-processing.com:8068/ws/currencies',
  );
  websocketClient.on('message', (data) => {
    console.log(data);
    brodcastMessage(data);
  });
}
function brodcastMessage(data) {
  wss.clients.forEach((client) => client.send(data));
}
