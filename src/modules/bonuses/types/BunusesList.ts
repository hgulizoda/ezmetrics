export enum BonusesStatus {
  USED = 'used',
  NOT_USED = 'not_used',
  IN_PROGRESS = 'inprogress',
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
  removed_count: number;
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

export interface Bonus {
  ball: number;
  status: string;
  total_capacity: number;
  total_weight: number;
  _id: string;
}
