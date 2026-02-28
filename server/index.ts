import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createShare, getShare } from "./routes/share";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === "production";

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for markdown content

// API Routes
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", timestamp: Date.now() });
});

app.post("/api/share", createShare);
app.get("/api/share/:id", getShare);

// In production, serve static files
if (isProduction) {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));

  // SPA fallback - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
});

export default app;
