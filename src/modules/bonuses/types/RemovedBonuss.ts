export interface IRemovedBonusesRes {
  _id: string;
  order: {
    _id: string;
    description: string;
  };
  user_bonus: string;
  given_ball: number;
  order_capacity: number;
  order_weight: number;
  is_removed: boolean;
  removed_at: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface IRemovedBonuses {
  id: string;
  ball: number;
  orderName: string;
}
