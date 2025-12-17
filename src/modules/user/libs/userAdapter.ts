import { IUser, IUserRes } from '../types/User';

const userRes = (item: IUserRes): IUser => ({
  firstName: item.profile?.first_name ?? '',
  lastName: item.profile?.last_name ?? '',
  customerId: item.user_id ?? '',
  phone: item.phone_number ?? '',
  status: item.status ?? '',
  orders: item.order_count ?? 0,
  company: item.profile?.company_name ?? '',
  id: item?._id ?? '',
  userId: item?.profile?._id ?? '',
  fullName: `${item.profile?.first_name ?? ''} ${item.profile?.last_name ?? ''}`,
  createdAt: item.created_at,
});

export const userAdapter = (data: IUserRes[]) => data?.map(userRes) || [];
