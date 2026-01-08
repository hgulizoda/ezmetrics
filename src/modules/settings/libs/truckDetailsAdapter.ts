import { ITruckDetails, ITruckOrderRes } from '../types/truckDetails';

const truckDetails = (item: ITruckOrderRes): ITruckDetails => ({
  id: item._id ?? '',
  status: item.status ?? '',
  orderCapacity: item.order_capacity ?? 0,
  orderCost: item.order_cost ?? 0,
  orderID: item.order_id ?? 0,
  orderWeight: item.order_weight ?? 0,
  statusUpdatedDate: item.status_updated_at ?? '',
  userID: item.user.user_id ?? '',
  clientID: item.user._id ?? '',
  description: item.description ?? '',
  totalCount: item.total_count ?? 0,
  totalPlace: item.total_places ?? 0,
  isCustomsByUser: item.isCustomsByUser ?? false,
});

export const truckDetailsAdapter = (data: ITruckOrderRes[]) => data?.map(truckDetails) || [];
