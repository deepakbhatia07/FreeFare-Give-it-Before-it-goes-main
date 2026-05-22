const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const dotenv = require("dotenv");
const cors = require("cors");
const url = require("url");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");
const { errorHandler } = require("./middlewares/errorMiddleware");
const { apiLimiter } = require("./middlewares/rateMiddleware");
const { connectRedis } = require("./utils/redisClient");

const ChatMessage = require("./models/ChatMessage");

dotenv.config({ path: path.resolve(__dirname, "../.env") });
connectDB();
connectRedis();

// Initialize Express application
const app = express();

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Global middlewares configuration
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// Route-specific middlewares and router controllers
app.use("/api", apiLimiter);
app.use("/uploads", express.static("uploads"));

app.use("/api", require("./routes/publicRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api", require("./routes/chatRoutes"));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Set up server and WebSocket server for real-time chat messages
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, req) => {
  const { requestId } = url.parse(req.url, true).query;

  if (!requestId) {
    ws.close();
    return;
  }

  ws.requestId = requestId;
  console.log("WebSocket connected:", requestId);

  ws.on("message", async (message) => {
    const data = JSON.parse(message);

    const saved = await ChatMessage.create({
      requestId: ws.requestId,
      sender: data.sender,
      text: data.text,
    });

    const populated = await saved.populate("sender", "name");

    wss.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        client.requestId === ws.requestId
      ) {
        client.send(JSON.stringify(populated));
      }
    });
  });

  ws.on("close", () => {
    console.log("WebSocket disconnected:", ws.requestId);
  });
});

server.listen(PORT, () => {
  console.log(`Server + WebSocket running on port ${PORT}`);
});