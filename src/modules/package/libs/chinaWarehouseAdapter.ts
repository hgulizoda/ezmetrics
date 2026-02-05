import { IChinaWarehouse, IGetChinaWarehouseRes } from '../types/ChinaWarehouse';

export const chinaWarehouse = (item: IGetChinaWarehouseRes): IChinaWarehouse => ({
  clientId: item.user.user_id ?? '',
  packageCapacity: item.order_capacity ?? '',
  packageId: item.order_id ?? 0,
  packageDate: item.order_date ?? '',
  status: item.status ?? '',
  statusUpdate: item.status_updated_at ?? '',
  id: item._id ?? '',
  userId: item.user._id ?? '',
  firstName: item.user.first_name ?? '',
  lastName: item.user.last_name ?? '',
  packageWeight: item.order_weight ?? '',
  fullName: `${item.user.first_name} ${item.user.last_name}`,
  totalCount: item.total_count ?? 0,
  totalPlaces: item.total_places ?? 0,
  description: item.description ?? '',
  isCustomsByUser: item.isCustomsByUser ?? false,
  packagingType: item.packagingType ?? "NONE"
});

export const chinaWarehouseAdapter = (data?: IGetChinaWarehouseRes[]) =>
  data?.map(chinaWarehouse) || [];
