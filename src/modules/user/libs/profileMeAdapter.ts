import { IProfileMe, IProfileMeRes } from '../types/Profile';

export const getProfileAdapter = (item: IProfileMeRes): IProfileMe => ({
  firstName: item.first_name ?? '',
  lastName: item.last_name ?? '',
  avatar: item.user?.avatar ?? '',
  birthDate: item.birth_date ?? '',
  companyName: item.company_name ?? '',
  phone: item.user?.phone_number ?? '',
  email: item.user?.email ?? '',
  id: item._id ?? '',
  userId: item.user?._id ?? '',
  userUniqueId: item.user?.user_id ?? '',
  isBonusEnabled: item.isBonusEnabled ?? false,
});
