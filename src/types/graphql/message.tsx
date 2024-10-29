export interface Sender {
  _id: string;
  userName: string;
  profilePhoto: string | null;
}
export enum MessageType {
  TEXT = 'TEXT',
  MEDIA = 'MEDIA',
}

export enum MediaContentType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
}
export interface MediaContent {
  url: string;
  type: string;
  thumbnail?: string;
}
export interface Message {
  _id: string;
  type: MessageType;
  content: string | null;
  sender: Sender;
  media: MediaContent | null;
}
