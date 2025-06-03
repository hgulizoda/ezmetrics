import { IProfileOrders, IUserProfileRes } from '../types/UserProfileOrders';

export const getProfileOrder = (item: IUserProfileRes): IProfileOrders => ({
  id: item._id ?? '',
  description: item.description ?? '',
  orderId: item.order_id ?? '',
  status: item.status ?? '',
  statusHistory: item.status_history.map((el) => ({ status: el.status, date: el.date })) ?? [
    { status: '', date: '' },
  ],
  statusUpdatedAt: item.status_updated_at ?? '',
  orderCapacity: item.order_capacity ?? 0,
  deliveryAddress: item.delevery_address ?? '',
  deliveryDate: item.deleviry_date ?? '',
  orderDate: item.order_date ?? '',
  orderCost: item.order_cost ?? 0,
  orderWeight: item.order_weight ?? 0,
  images: item.images ?? [''],
  isPaid: item.is_paid ?? false,
  user: {
    id: item.user._id ?? '',
    phoneNumber: item.user.phone_number ?? '',
    userId: item.user.user_id ?? '',
    status: item.user.status ?? '',
    firstName: item.user.first_name ?? '',
    lastName: item.user.last_name ?? '',
  },
  createdAt: item.created_at ?? '',
  estimatedArrivalDate: item.estimated_arrival_date ?? '',
  totalCount: item.total_count ?? 0,
  totalPlaces: item.total_places ?? 0,
  note: item.note ?? '',
});

export const getProfileOrdersAdapter = (profileOrders: IUserProfileRes[]) =>
  profileOrders?.map(getProfileOrder) || [];
