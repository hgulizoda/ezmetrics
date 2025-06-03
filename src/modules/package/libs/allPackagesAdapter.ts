import { IAllPackagesRes, IAllPackagesAdapter } from '../types/AllPackages';

export const getPackage = (item: IAllPackagesRes): IAllPackagesAdapter => ({
  packageId: item.order_id ?? '',
  clientId: item.user.user_id ?? '',
  packageWeight: item.order_weight ?? '',
  packageDate: item.order_date ?? '',
  status: item.status ?? '',
  statusUpdate: item.status_updated_at ?? '',
  firstName: item.user.first_name ?? '',
  lastName: item.user.last_name ?? '',
  id: item._id ?? '',
  userId: item.user._id ?? '',
  fullName: `${item.user.first_name} ${item.user.last_name}`,
  totalCount: item.total_count ?? 0,
  totalPlaces: item.total_places ?? 0,
  truck: item.truck ?? '',
  packageCapacity: item.order_capacity ?? 0,
  description: item.description ?? '',
  containerNumber: item.container_number ?? '',
});

export const getAllPackagesAdapter = (data?: IAllPackagesRes[]) => data?.map(getPackage) || [];
