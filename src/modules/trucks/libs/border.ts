import { ITruckRes, ITruckAdapter } from '../types/ChinaBorder';

const chinaBorder = (item: ITruckRes): ITruckAdapter => ({
  id: item.truck?._id ?? '',
  name: item.truck?.name ?? '',
  orderCapacity: item.total_capacity ?? 0,
  ordersWeight: item.total_weight ?? 0,
  ordersCount: item.count ?? 0,
  createdAt: item.truck.created_at ?? '',
  estimatedDate: item.truck.estimated_arrival_date ?? '',
  containerNumber: item.truck.container_number ?? '',
  truckOrders: item.orders?.map((i) => ({
    id: i._id ?? '',
    orderCapacity: i.order_capacity ?? 0,
    orderID: i.order_id ?? '',
    orderType: i.order_type ?? '',
    orderWeight: i.order_weight ?? 0,
    clientID: i.user.user_id ?? '',
    status: i.status ?? '',
    userID: i.user._id ?? '',
    statusUpdatedDate: i.status_updated_at ?? '',
    note: i.note ?? '',
    totalPlace: i.total_places ?? 0,
    totalCount: i.total_count ?? 0,
  })),
});

export const chinaBorderAdapter = (data: ITruckRes[]) => data?.map(chinaBorder) || [];
