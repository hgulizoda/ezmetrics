interface UserProfile {
  user_id: string;
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
}

export interface IStatRes {
  total_orders: number;
  total_weight: number;
  total_capacity: number;
  total_places: number;
  profile: UserProfile;
}

export interface Pagination {
  total_records: number;
  current_page: number;
  total_pages: number;
  next_page: number;
  prev_page: number;
}

export interface IStat {
  fullName: string;
  userId: string;
  phone: string;
  company: string;
  totalOrders: number;
  totalWeight: number;
  totalCapacity: number;
  totalPlaces: number;
}

export interface UsersResponse {
  users: IStatRes[];
  total_users: number;
  total_orders: number;
  total_weight: number;
  total_capacity: number;
  total_places: number;
  pagination: Pagination;
}
