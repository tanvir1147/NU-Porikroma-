// socket-server.ts - Separate Socket.IO server
import { setupSocket } from '@/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';

const SOCKET_PORT = 12348;
const hostname = '127.0.0.1';

// Create HTTP server for Socket.IO only
const server = createServer();

// Setup Socket.IO
const io = new Server(server, {
  path: '/api/socketio',
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

setupSocket(io);

// Start the Socket.IO server
server.listen(SOCKET_PORT, hostname, () => {
  console.log(`> Socket.IO server running at ws://${hostname}:${SOCKET_PORT}/api/socketio`);
});

export { io };