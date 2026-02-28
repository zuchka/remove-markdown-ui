// Shared types between client and server

// Demo endpoint response
export interface DemoResponse {
  message: string;
  timestamp: number;
}

// Share functionality types
export interface SharePayload {
  markdown: string;
  // Legacy support for old single-library format
  options?: Record<string, any>;
  // New multi-library support
  selectedLibraries?: string[];
  libraryOptions?: Record<string, Record<string, any>>;
  metadata?: {
    title?: string;
    description?: string;
  };
}

export interface ShareResponse {
  id: string;
  shortUrl: string;
}

export interface ShareData extends SharePayload {
  createdAt: number;
}
