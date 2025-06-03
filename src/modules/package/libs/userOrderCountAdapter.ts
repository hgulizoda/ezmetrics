import { IProfileOrderCount } from '../types/UserOrderCount';

export const userOrderCountAdapter = (item: IProfileOrderCount): IProfileOrderCount => ({
  total: item.total ?? 0,
  active: item.active ?? 0,
  delivered: item.delivered ?? 0,
});
