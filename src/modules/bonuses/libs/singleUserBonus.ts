import { IOrderWithBonus, IOrderWithBonusRes } from '../types/SingleUserBonus';

export const singleBonusAdapter = (item: IOrderWithBonusRes): IOrderWithBonus => ({
  orderId: item.order?.order_id ?? '',
  ball: item.given_ball ?? 0,
  id: item._id ?? '',
  orderName: item.order?.description ?? '',
});

export const singleBonusMapper = (data: IOrderWithBonusRes[]) =>
  data?.map(singleBonusAdapter) || [];
