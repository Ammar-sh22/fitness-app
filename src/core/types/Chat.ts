// src/core/types/Chat.ts

export type ChatType = 'client_coach' | 'client_nutritionist' | 'support';

export interface Chat {
  id: string;
  type: ChatType;

  clientId: string;
  coachId?: string;
  nutritionistId?: string;

  lastMessagePreview?: string;
  lastMessageAt?: string;

  createdAt: string;
  updatedAt: string;
}

export type MessageType = 'text' | 'image' | 'file';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;

  type: MessageType;
  text?: string;
  fileUrl?: string;
  fileName?: string;

  createdAt: string; // message timestamp
}
