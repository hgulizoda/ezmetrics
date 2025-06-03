export interface StoreRes {
  _id: string;
  receiver: string;
  phone_number: string;
  recieving_date: string;
  store_address: string;
  wechat_id: string;
}

export interface Store {
  id: string;
  receiver: string;
  phone: string;
  date: string;
  address: string;
  wechat: string;
}
