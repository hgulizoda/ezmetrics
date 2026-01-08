import { OrderStatus } from 'src/types/TableStatus';

import { IResiduePackage, IResiduePackageRes } from '../types/ResiduePackage';

export const resiuepackages = (item: IResiduePackageRes): IResiduePackage => ({
  id: item._id ?? '',
  userId: item.user._id ?? '',
  packageId: item.order_id ?? 0,
  clientId: item.user.user_id ?? '',
  packageCapacity: item.order_capacity ?? '',
  packageDate: item.order_date ?? '',
  status: item.status ?? OrderStatus.PENDING,
  statusUpdate: item.status_updated_at ?? '',
  firstName: item.user.first_name ?? '',
  lastName: item.user.last_name ?? '',
  packageWeight: item.order_weight ?? '',
  fullName: `${item.user.first_name} ${item.user.last_name}`,
  totalCount: item.total_count ?? 0,
  totalPlaces: item.total_places ?? 0,
  orderType: item.order_type ?? '',
  truck: item.truck ?? '',
  description: item.description ?? '',
  containerNumber: item.container_number ?? '',
  isCustomsByUser: item.isCustomsByUser ?? false,
});

export const residuePackagesAdapter = (data?: IResiduePackageRes[]) =>
  data?.map(resiuepackages) || [];
