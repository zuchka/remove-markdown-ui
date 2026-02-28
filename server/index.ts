import express from "express";
import cors from "cors";
import { createShare, getShare } from "./routes/share";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for markdown content

// API Routes
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", timestamp: Date.now() });
});

app.post("/api/share", createShare);
app.get("/api/share/:id", getShare);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
