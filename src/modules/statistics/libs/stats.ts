import { IStat, IStatRes } from '../types/Stats';

export const statisticsAdapter = (item: IStatRes): IStat => ({
  fullName: `${item.profile.first_name} ${item.profile.last_name}`,
  userId: item.profile?.user_id ?? '',
  phone: item.profile?.phone_number ?? '',
  company: item.profile.company_name ?? '',
  totalOrders: item.total_orders ?? 0,
  totalWeight: item.total_weight ?? 0,
  totalCapacity: item.total_capacity ?? 0,
  totalPlaces: item.total_places ?? 0,
});

export const statisticsMapper = (data: IStatRes[]) => data?.map(statisticsAdapter) || [];
