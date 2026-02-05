import { OrderStatus } from 'src/types/TableStatus';

interface User {
  _id: string;
  phone_number: string;
  status: 'notverified' | string;
  user_id: string;
  id: string;
  first_name: string;
  last_name: string;
}

export interface IAllPackagesRes {
  images: string[];
  _id: string;
  is_paid: boolean;
  order_cost: number;
  order_date: string;
  order_weight: number;
  order_capacity: number;
  order_id: number;
  status: OrderStatus;
  status_updated_at: string;
  total_count: number;
  total_places: number;
  user: User;
  description: string;
  truck: string;
  container_number: string;
  isCustomsByUser: boolean;
  packagingType: string
}

export interface IAllPackagesAdapter {
  packageId: number;
  clientId: string;
  packageWeight: number;
  packageCapacity: number;
  packageDate: string;
  status: OrderStatus;
  statusUpdate: string;
  firstName: string;
  lastName: string;
  id: string;
  userId: string;
  totalCount: number;
  totalPlaces: number;
  fullName: string;
  truck: string;
  description: string;
  containerNumber: string;
  isCustomsByUser: boolean;
  packagingType: string
}
