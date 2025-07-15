import { IOrderWithBonus, IOrderWithBonusRes } from '../types/SingleUserBonus';

export const singleBonusAdapter = (item: IOrderWithBonusRes): IOrderWithBonus => ({
  orderId: item.order?._id ?? '',
  ball: item.given_ball ?? 0,
  id: item._id ?? '',
  orderName: item.order?.description ?? '',
  weight: item.order?.order_weight ?? 0,
  capacity: item.order?.order_capacity ?? 0,
  count: item.order?.total_count ?? 0,
  places: item.order?.total_places ?? 0,
  userId: item.user_bonus?.user ?? '',
});

export const singleBonusMapper = (data: IOrderWithBonusRes[]) =>
  data?.map(singleBonusAdapter) || [];
