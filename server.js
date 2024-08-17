const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Обработка WebSocket соединений
wss.on('connection', ws => {
  console.log('New client connected');
  ws.on('message', message => {
    console.log('Received message:', message);
    // Передача сообщения всем подключенным клиентам
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Обслуживание статических файлов из директории 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Установка порта из переменной окружения PORT или 80
const port = process.env.PORT || 80;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
