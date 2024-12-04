const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the public folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle username setup
  socket.on('set username', (username) => {
    socket.username = username || 'Anonymous';
    console.log(`Username set: ${socket.username}`);
  });

  // Handle chat messages
  socket.on('chat message', (message) => {
    const username = socket.username || 'Anonymous';
    io.emit('chat message', { username, message });
  });

  socket.on('disconnect', () => {
    console.log(`${socket.username || 'A user'} disconnected`);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
