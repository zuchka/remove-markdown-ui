import { Handler } from "@netlify/functions";
import { nanoid } from "nanoid";

// Use Netlify Blobs for persistent storage
// For MVP, we'll use in-memory (note: this resets on each cold start)
// TODO: Integrate with Netlify Blobs or external DB for persistence
const shareStore = new Map<string, any>();

export const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    
    // Validate payload
    if (!payload.markdown || !payload.options) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing markdown or options" }),
      };
    }

    // Generate unique short ID (8 characters)
    const id = nanoid(8);
    
    // Store the share data
    const shareData = {
      markdown: payload.markdown,
      options: payload.options,
      createdAt: Date.now(),
    };
    
    shareStore.set(id, shareData);
    
    // Return response
    const response = {
      id,
      shortUrl: `/s/${id}`,
    };
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error creating share:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create share" }),
    };
  }
};
