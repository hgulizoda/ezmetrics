export interface IUserProfileRes {
  _id: string;
  description: string;
  order_id: number;
  status: string;
  note: string;
  created_at: string;
  estimated_arrival_date: string;
  status_history: {
    status: string;
    date: string;
  }[];
  status_updated_at: string;
  order_capacity: number;
  delevery_address: string;
  deleviry_date: string;
  order_date: string;
  order_cost: number;
  order_weight: number;
  images: string[];
  is_paid: boolean;
  user: {
    _id: string;
    phone_number: string;
    user_id: string;
    status: string;
    first_name: string;
    last_name: string;
  };
  total_count: number;
  total_places: number;
}

export interface IProfileOrders {
  id: string;
  description: string;
  orderId: number;
  status: string;
  statusHistory: {
    status: string;
    date: string;
  }[];
  statusUpdatedAt: string;
  orderCapacity: number;
  deliveryAddress: string;
  deliveryDate: string;
  orderDate: string;
  orderCost: number;
  orderWeight: number;
  images: string[];
  isPaid: boolean;
  user: {
    id: string;
    phoneNumber: string;
    userId: string;
    status: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  estimatedArrivalDate: string;
  totalCount: number;
  totalPlaces: number;
  note: string;
}
