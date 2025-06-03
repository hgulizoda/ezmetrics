import { Store, StoreRes } from '../types/Store';

export const storeAdapter = (item: StoreRes): Store => ({
  id: item?._id ?? '',
  address: item?.store_address ?? '',
  date: item?.recieving_date ?? '',
  phone: item?.phone_number ?? '',
  receiver: item?.receiver ?? '',
  wechat: item?.wechat_id ?? '',
});

export const storeMapper = (data: StoreRes[]) => data.map(storeAdapter) || [];
