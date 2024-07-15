export interface ResponseModel {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
  system_fingerprint: string;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface Choice {
  index: number;
  message: Message;
  logprobs: null;
  finish_reason: string;
}

interface Message {
  role: string;
  content: string;
}