export interface ITruckRes {
  count: number;
  total_weight: number;
  total_capacity: number;
  truck: TruckDetails;
  orders: Order[];
}

interface TruckDetails {
  _id: string;
  name: string;
  estimated_arrival_date: string;
  created_at: string;
  container_number: string;
}

interface Order {
  _id: string;
  order_id: string;
  status: string;
  status_history: StatusHistory[];
  status_updated_at: string;
  deleviry_date: string;
  description: string;
  order_date: string;
  order_type: string;
  order_weight: number;
  note: string;
  total_count: number;
  total_places: number;
  order_capacity: number;
  is_paid: boolean;
  images: string[];
  created_at: string;
  updated_at: string;
  user: UserDetails;
}

interface StatusHistory {
  status: string;
  date: string;
  _id: string;
}

interface UserDetails {
  _id: string;
  user_id: string;
  phone_number: string;
  status: string;
}

export interface ITruckOrderAdapter {
  id: string;
  clientID: string;
  userID: string;
  orderID: string;
  status: string;
  statusUpdatedDate: string;
  orderWeight: number;
  orderCapacity: number;
  orderType: string;
  note: string;
  totalPlace: number;
  totalCount: number;
}

export interface ITruckAdapter {
  name: string;
  id: string;
  ordersCount: number;
  ordersWeight: number;
  orderCapacity: number;
  truckOrders: ITruckOrderAdapter[];
  estimatedDate: string;
  createdAt: string;
  containerNumber: string;
}
