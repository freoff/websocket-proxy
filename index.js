const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const port = process.env.PORT || 3000;
const app = express();

//initialize a simple http server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
//initialize the WebSocket server instance
var lastResult;
const wss = new WebSocket.Server({ server });
var wsClient;
wss.on('connection', (ws) => {
  if (lastResult) {
    console.log('sending last result', lastResult.length);
    ws.send(lastResult);
  }
  openConnectionToFeatureProcessing();
});
function openConnectionToFeatureProcessing() {
  console.log('open connection? ');
  if (!wsClient) {
    wsClient = new WebSocket(
      'ws://webtask.future-processing.com:8068/ws/currencies',
    );
    wsClient.on('message', (data) => {
      brodcastMessage(data);
      lastResult = data;
    });
    console.log('create connection');
  }
}
function brodcastMessage(data) {
  wss.clients.forEach((client) => client.send(data));
}
