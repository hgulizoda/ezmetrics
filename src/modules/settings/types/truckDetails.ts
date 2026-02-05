export interface ITruckDetailsResponse {
  _id: string;
  name: string;
  orders: ITruckOrderRes[];
}

export interface ITruckOrderRes {
  _id: string;
  user: UserDetails;
  order_id: string;
  status: string;
  description: string;
  status_updated_at: string;
  deleviry_date: string;
  delevery_address: string;
  order_date: string;
  order_cost: number;
  order_weight: number;
  order_capacity: number;
  images: string[];
  order_type: string;
  total_count: number;
  total_places: number;
  isCustomsByUser: boolean;
  packagingType: string
}

interface UserDetails {
  _id: string;
  phone_number: string;
  user_id: string;
}

export interface ITruckDetails {
  id: string;
  clientID: string;
  userID: string;
  orderID: string;
  status: string;
  statusUpdatedDate: string;
  orderCost: number;
  orderWeight: number;
  orderCapacity: number;
  description: string;
  totalCount: number;
  totalPlace: number;
  isCustomsByUser: boolean;
  packagingType: string
}
