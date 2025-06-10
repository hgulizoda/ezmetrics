export enum BonusesStatus {
  USED = 'used',
  NOT_USED = 'not_used',
  IN_PROGRESS = 'in_progress',
}
export interface IBonusesList {
  profile: Profile;
  user: User;
  _id: string;
  id: string;
  ball: number;
  total_weight: number;
  total_capacity: number;
  volume_limit: number;
  status: BonusesStatus;
}
interface Profile {
  _id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  company_name: string;
  avatar: string;
  user: User;
}
interface User {
  _id: string;
  phone_number: string;
  status: string;
  user_id: string;
  profile: string;
  order_count: number;
}
