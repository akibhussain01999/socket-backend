import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const port = 3001;

// Create HTTP server
const httpServer = createServer(app);

// Middleware to parse JSON requests
app.use(express.json());

// Simple GET endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

// Example POST endpoint
app.post('/data', (req: Request, res: Response) => {
  const data = req.body;
  res.json({ message: 'Data received', data });
});

// Initialize Socket.IO server
const io = new Server(httpServer, {
  path: "/admin-panel",
  cors: {
    origin: "socket-frontend-production.up.railway.app",
    methods: ["GET", "POST"],
  },
  // pingTimeout: 60000, // Uncomment if needed
  // pingInterval: 25000 // Uncomment if needed
});

io.on("connection", (socket) => {
  console.log("A user connected");
  // You can set the socket to some global variable or context if needed
  app.locals.socket = socket;

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // Handle `request_status` event if needed
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
