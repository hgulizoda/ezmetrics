import { OrderStatus } from 'src/types/TableStatus';

export interface IResiduePackageRes {
  _id: string;
  description: string;
  order_id: number;
  order_capacity: number;
  order_weight: number;
  order_date: string;
  order_cost: number;
  images: string[];
  is_paid: boolean;
  status: OrderStatus;
  status_updated_at: string;
  total_count: number;
  total_places: number;
  order_type: string;
  container_number: string;
  isCustomsByUser: boolean;
  packagingType: string,
  user: {
    _id: string;
    phone_number: string;
    user_id: string;
    status: string;
    first_name: string;
    last_name: string;
  };
  truck: string;
}

export interface IResiduePackage {
  id: string;
  userId: string;
  packageId: number;
  clientId: string;
  packageCapacity: number;
  packageWeight: number;
  packageDate: string;
  status: OrderStatus;
  statusUpdate: string;
  firstName: string;
  lastName: string;
  fullName: string;
  totalCount: number;
  totalPlaces: number;
  orderType: string;
  truck: string;
  description: string;
  containerNumber: string;
  isCustomsByUser: boolean;
  packagingType: string
}

export interface IChinaBorderUpdate {
  status: string;
  truck: string;
}
