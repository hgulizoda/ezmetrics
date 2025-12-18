import { UserStatus } from 'src/types/UserStatus';

export interface IUserRes {
  _id: string;
  phone_number: string;
  status: UserStatus;
  user_id: string;
  order_count: number;
  created_at: string;
  profile: {
    _id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    company_name: string;
    avatar: string;
  };
}

export interface IUser {
  firstName: string;
  lastName: string;
  customerId: string;
  phone: string;
  status: UserStatus;
  orders: number;
  company: string;
  id: string;
  userId: string;
  fullName: string;
  createdAt: string;
}
