export interface IOrderWithBonusRes {
  _id: string;
  order: {
    _id: string;
    user: string;
    order_id: string;
    status: string;
    status_history: {
      status: string;
      date: string;
      _id: string;
    }[];
    description: string;
    status_updated_at: string;
    order_date: string;
    order_weight: number;
    order_capacity: number;
    is_paid: boolean;
    images: string[];
    order_type: string;
    total_count: number;
    total_places: number;
    is_archived: boolean;
    note: string;
    created_at: string;
    updated_at: string;
    __v: number;
    truck: string;
    transit_zone: string;
  };
  user_bonus: {
    _id: string;
    user: string;
    profile: string;
    ball: number;
    total_weight: number;
    total_capacity: number;
    is_reached_limit: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    __v: number;
  };
  given_ball: number;
  order_capacity: number;
  order_weight: number;
  is_removed: boolean;
  removed_at: string | null;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface IOrderWithBonus {
  orderId: string;
  ball: number;
  id: string;
  orderName: string;
}
