
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GeneratedImage {
  style: string;
  imageUrl: string;
}
