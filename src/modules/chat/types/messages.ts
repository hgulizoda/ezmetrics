export interface IMessageRes {
  _id: string;
  content: string;
  created_at: string; // ISO string format
  is_deleted: boolean;
  room: string;
  reply_to:
    | {
        _id: string;
        room: string;
        sender_type: 'admin' | 'user'; // add more roles if needed
        sender: string;
        type: 'text' | 'image' | 'video' | 'file'; // adjust types based on your app
        content: string;
        file_url: string[]; // array for multiple attachments
        status: 'sent' | 'delivered' | 'seen'; // expand as needed
        is_deleted: boolean;
        reply_to: string; // optional if no reply
        created_at: string; // ISO date string
        updated_at: string;
        __v: number;
      }
    | string;
  sender: string;
  sender_type: 'admin' | 'user'; // assuming only 'admin' or 'user' types exist
  status: 'sent' | 'read'; // extendable if needed
  type: 'text' | 'image' | 'video' | 'file' | 'audio' | 'gif'; // assuming possible types
  updated_at: string;
  file_url?: string[];
  __v: number;
}
