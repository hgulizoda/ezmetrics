import { IBonusesList, BonusesStatus } from '../types/BunusesList';

export const getBonuses = (item?: IBonusesList): IBonusesList => ({
  _id: item?._id ?? '',
  id: item?._id ?? '',
  ball: item?.ball ?? 0,
  total_weight: item?.total_weight ?? 0,
  total_capacity: item?.total_capacity ?? 0,
  volume_limit: item?.volume_limit ?? 0,
  status: item?.status ?? BonusesStatus.NOT_USED,
  removed_count: item?.removed_count ?? 0,
  user: {
    _id: item?.user._id ?? '',
    phone_number: item?.user.phone_number ?? '',
    status: item?.user.status ?? '',
    user_id: item?.user.user_id ?? '',
    profile: item?.user.profile ?? '',
    order_count: item?.user.order_count ?? 0,
  },
  profile: {
    _id: item?.profile._id ?? '',
    first_name: item?.profile.first_name ?? '',
    last_name: item?.profile.last_name ?? '',
    birth_date: item?.profile.birth_date ?? '',
    company_name: item?.profile.company_name ?? '',
    avatar: item?.profile.avatar ?? '',
    user: {
      _id: item?.profile.user._id ?? '',
      phone_number: item?.profile.user.phone_number ?? '',
      status: item?.profile.user.status ?? '',
      user_id: item?.profile.user.user_id ?? '',
      profile: item?.profile.user.profile ?? '',
      order_count: item?.profile.user.order_count ?? 0,
    },
  },
});

export const getBonusesAdapter = (data?: IBonusesList[]) =>
  data?.map((item) => getBonuses(item)) ?? [];
