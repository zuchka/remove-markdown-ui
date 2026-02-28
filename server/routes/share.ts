import { RequestHandler } from "express";
import { nanoid } from "nanoid";
import { SharePayload, ShareResponse, ShareData } from "@shared/api";

// In-memory store for shares
const shareStore = new Map<string, ShareData>();

// Optional: Cleanup old shares (30 days)
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Run cleanup daily
setInterval(() => {
  const thirtyDaysAgo = Date.now() - THIRTY_DAYS_MS;
  for (const [id, data] of shareStore.entries()) {
    if (data.createdAt < thirtyDaysAgo) {
      shareStore.delete(id);
    }
  }
}, 24 * 60 * 60 * 1000);

// Create a new share
export const createShare: RequestHandler = (req, res) => {
  try {
    const payload: SharePayload = req.body;
    
    // Validate payload
    if (!payload.markdown || !payload.options) {
      res.status(400).json({ error: "Missing markdown or options" });
      return;
    }

    // Generate unique short ID (8 characters)
    const id = nanoid(8);
    
    // Store the share data
    const shareData: ShareData = {
      markdown: payload.markdown,
      options: payload.options,
      createdAt: Date.now(),
    };
    
    shareStore.set(id, shareData);
    
    // Return response
    const response: ShareResponse = {
      id,
      shortUrl: `/s/${id}`,
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error creating share:", error);
    res.status(500).json({ error: "Failed to create share" });
  }
};

// Retrieve a share by ID
export const getShare: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    const shareData = shareStore.get(id);
    
    if (!shareData) {
      res.status(404).json({ error: "Share not found" });
      return;
    }
    
    res.json(shareData);
  } catch (error) {
    console.error("Error retrieving share:", error);
    res.status(500).json({ error: "Failed to retrieve share" });
  }
};
