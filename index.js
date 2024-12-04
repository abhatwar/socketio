const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Set username when received from the client
  socket.on('set username', (username) => {
    socket.username = username;
    console.log(`Username set: ${username}`);
  });

  // Handle chat messages
  socket.on('chat message', (message) => {
    const username = socket.username || 'Anonymous'; // Fallback to 'Anonymous' if no username set
    io.emit('chat message', { username, message }); // Broadcast the message with the username
  });

  socket.on('disconnect', () => {
    console.log(`${socket.username || 'A user'} disconnected`);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
