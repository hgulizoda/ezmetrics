export interface IProfileMeRes {
  _id: string;
  user: {
    _id: string;
    phone_number: string;
    email: string;
    user_id: string;
    avatar: string;
  };
  avatar: string;
  birth_date: string;
  company_name: string;
  created_at: string;
  first_name: string;
  is_deleted: boolean;
  last_name: string;
  updated_at: string;
  isBonusEnabled: boolean;
}

export interface IProfileMe {
  firstName: string;
  lastName: string;
  avatar: string;
  birthDate: string;
  companyName: string;
  phone: string;
  email: string;
  id: string;
  userId: string;
  userUniqueId: string;
  isBonusEnabled: boolean;
}
