export interface IRemovedBonusesRes {
  _id: string;
  order: {
    _id: string;
    description: string;
    order_capacity: number;
    order_weight: number;
    total_count: number;
    total_places: number;
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
