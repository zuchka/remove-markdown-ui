import { Handler } from "@netlify/functions";

// Shared store (note: in-memory resets on cold starts)
// TODO: Integrate with Netlify Blobs or external DB for persistence
const shareStore = new Map<string, any>();

export const handler: Handler = async (event) => {
  // Only allow GET
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Extract ID from path
    const id = event.path.split("/").pop();
    
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Share ID required" }),
      };
    }
    
    const shareData = shareStore.get(id);
    
    if (!shareData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Share not found" }),
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shareData),
    };
  } catch (error) {
    console.error("Error retrieving share:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve share" }),
    };
  }
};
