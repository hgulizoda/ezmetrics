export interface IMessageRes {
  _id: string;
  content: string;
  created_at: string; // ISO string format
  is_deleted: boolean;
  room: string;
  reply_to: string;
  sender: string;
  sender_type: 'admin' | 'user'; // assuming only 'admin' or 'user' types exist
  status: 'sent' | 'read'; // extendable if needed
  type: 'text' | 'image' | 'video' | 'file' | 'audio' | 'gif'; // assuming possible types
  updated_at: string;
  file_url?: string[];
  __v: number;
}
