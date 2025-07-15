import { IRemovedBonusesRes } from '../types/RemovedBonuss';

export const removedBallsAdapter = (item: Partial<IRemovedBonusesRes>): IRemovedBonusesRes => ({
  _id: item._id ?? '',
  order: {
    _id: item.order?._id ?? '',
    description: item.order?.description ?? '',
    order_capacity: item.order?.order_capacity ?? 0,
    order_weight: item.order?.order_weight ?? 0,
    total_count: item.order?.total_count ?? 0,
    total_places: item.order?.total_places ?? 0,
  },
  user_bonus: item.user_bonus ?? '',
  given_ball: item.given_ball ?? 0,
  order_capacity: item.order_capacity ?? 0,
  order_weight: item.order_weight ?? 0,
  is_removed: item.is_removed ?? false,
  removed_at: item.removed_at ?? '',
  created_at: item.created_at ?? '',
  updated_at: item.updated_at ?? '',
  __v: item.__v ?? 0,
});

export const removedBallsMapper = (data: Partial<IRemovedBonusesRes>[] = []) =>
  data?.map(removedBallsAdapter) || [];
