export interface ChatHistoryItem {
  text: string;
  isUser?: boolean;
  role?: 'user' | 'model';
}

export interface ChatRequestBody {
  message: string;
  history?: ChatHistoryItem[];
}

export interface ChatResponse {
  success: boolean;
  reply?: string;
  error?: string;
  isDemo?: boolean;
  timestamp: string;
}
