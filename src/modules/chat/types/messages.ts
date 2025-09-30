import { OrderStatus } from 'src/types/TableStatus';

export interface IMessageRes {
  _id: string;
  content: string;
  created_at: string; // ISO string format
  is_deleted: boolean;
  room: string;
  additional_info: {
    _id: string;
    description: string;
    order_id: string;
    status: OrderStatus;
    status_history: Array<{
      status: OrderStatus;
      date: string;
    }>;
    status_updated_at: string;
    order_capacity: number;
    order_date: string;
    order_type: string;
    order_weight: number;
    is_paid: boolean;
    is_feedback_given: boolean;
    truck: string | null;
    container_number: string | null;
    estimated_arrival_date: string | null;
    transit_zone: string;
    total_count: number;
    total_places: number | null;
    note: string | null;
    created_at: string | null;
  } | null;
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
  metadata?: {
    id: string;
    ball: number;
    total_weight: number;
    total_capacity: number;
  };
  ball: 80;
  id: string;
  total_capacity: number;
  total_weight: number;
  __v: number;
}
