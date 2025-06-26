interface Admin {
  admin: string; // Likely an internal identifier, but the value is empty in the provided data
  branch: string[]; // Array of branch IDs
  created_at: string; // ISO 8601 date and time string
  dob: string; // Date of birth as an ISO 8601 date and time string
  father_name: string;
  first_name: string;
  is_deleted: boolean;
  last_login_time: string; // ISO 8601 date and time string
  last_name: string;
  last_seen: string; // ISO 8601 date and time string
  password: string; // Hashed password
  phone: string;
  role: 'superadmin';
  updated_at: string; // ISO 8601 date and time string
  __v: number;
  _id: string; // Unique identifier
}

interface LastMessage {
  content: string;
  created_at: string; // ISO 8601 date and time string
  is_deleted: boolean;
  read_at: string; // ISO 8601 date and time string
  room: string; // Room identifier
  sender: string; // User identifier of the sender
  sender_type: 'user';
  status: 'read';
  type: string;
  updated_at: string; // ISO 8601 date and time string
  __v: number;
  _id: string; // Unique identifier
}

export interface Profile {
  app_lang: 'uz';
  avatar: string;
  birth_date: string; // ISO 8601 date and time string
  company_name: string;
  created_at: string; // ISO 8601 date and time string
  first_name: string;
  is_deleted: boolean;
  last_name: string;
  updated_at: string; // ISO 8601 date and time string
  user: string; // User identifier
  __v: number;
  _id: string; // Unique identifier
}

interface UserInfo {
  created_at: string; // ISO 8601 date and time string
  is_deleted: boolean;
  last_seen: string; // ISO 8601 date and time string
  phone_number: string;
  role: 'user';
  status: 'notverified';
  updated_at: string; // ISO 8601 date and time string
  user_id: string;
  __v: number;
  _id: string; // Unique identifier
}

export interface ICustomerRes {
  admin: Admin;
  last_message: LastMessage;
  last_message_at: string;
  profile: Profile;
  user: UserInfo;
  _id: string;
  unread_count_admin: number;
}

export interface IOnlineUsers {
  isAdmin: boolean;
  user_id: string;
}

export interface IMessage {
  content: string;
  created_at: string; // ISO 8601 date and time string
  is_deleted: boolean;
  room: string; // Room identifier
  sender: string; // Identifier of the sender (either user or admin)
  sender_type: 'admin' | 'user';
  status: 'sent' | 'read' | 'delivered' | string; // Add other possible statuses if needed
  type: 'text' | 'image' | 'video' | 'audio' | string; // Add other possible types if needed
  updated_at: string; // ISO 8601 date and time string
  __v: number;
  _id: string; // Unique identifier
}

export interface ArchivedMessage {
  _id: string;
  room: string;
  sender_type: 'user' | 'admin';
  sender: string;
  type: 'text' | 'image' | 'video' | 'audio' | string;
  content: string;
  file_url: string[];
  file_name: string | null;
  status: 'read' | 'sent' | 'delivered' | string;
  is_deleted: boolean;
  reply_to: string | null;
  created_at: string;
  updated_at: string;
  __v: number;
  read_at: string;
}
