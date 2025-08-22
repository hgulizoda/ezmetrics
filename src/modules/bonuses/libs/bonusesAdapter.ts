import { Bonus } from '../types/BunusesList';

export const getBonuses = (item?: Bonus) => ({
  _id: item?._id ?? '',
  ball: item?.ball ?? 0,
  total_weight: item?.total_weight ?? 0,
  total_capacity: item?.total_capacity ?? 0,
  status: item?.status ?? '',
});

export const getBonusesAdapter = (data?: Bonus[]) => data?.map(getBonuses) ?? [];
