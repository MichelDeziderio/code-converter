export interface RequestModel {
  messages: Message[];
  model: string;
}

interface Message {
  role: string;
  content: string;
}