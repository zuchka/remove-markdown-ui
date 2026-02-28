// Shared types between client and server

// Demo endpoint response
export interface DemoResponse {
  message: string;
  timestamp: number;
}

// Share functionality types
export interface SharePayload {
  markdown: string;
  options: Record<string, any>;
}

export interface ShareResponse {
  id: string;
  shortUrl: string;
}

export interface ShareData extends SharePayload {
  createdAt: number;
}
