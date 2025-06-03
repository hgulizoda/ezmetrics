import { OrderStatus } from 'src/types/TableStatus';

export interface ITranzitZoneRes {
  _id: string;
  description: string;
  order_id: number;
  order_capacity: number;
  order_weight: number;
  order_date: string;
  order_cost: number;
  images: string[];
  is_paid: boolean;
  status: OrderStatus;
  status_updated_at: string;
  total_count: number;
  total_places: number;
  transit_zone: string;
  user: {
    _id: string;
    phone_number: string;
    user_id: string;
    status: string;
    first_name: string;
    last_name: string;
  };
  truck: string;
}
