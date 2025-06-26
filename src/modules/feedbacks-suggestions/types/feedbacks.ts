export interface IOrderStatusHistory {
  status:
    | 'in_china_warehouse'
    | 'to_china_border'
    | 'in_transit'
    | 'to_uzb_customs'
    | 'in_customs'
    | 'delivered'; // Extend with all possible statuses
  date: string; // ISO format
}

export interface IOrder {
  _id: string;
  description: string;
  order_id: string;
  status: IOrderStatusHistory['status'];
  status_history: IOrderStatusHistory[];
  status_updated_at: string;
  order_capacity: number;
  order_date: string;
  order_type: 'full' | 'partial'; // Add other types if exist
  order_weight: number;
  images: string[]; // assuming images are URLs, adjust if needed
  is_paid: boolean;
  user: Record<string, unknown>; // or a proper IUser interface
  truck: string | null;
  container_number: string | null;
  estimated_arrival_date: string | null;
  is_archived: boolean;
  transit_zone: 'kg' | 'uz' | 'cn'; // extend with valid zones
  total_count: number;
  total_places: number;
  note: string;
  created_at: string;
}

export interface ReviewItemRes {
  _id: string;
  rating: number;
  user: {
    _id: string;
    phone_number: string;
    status: string;
    user_id: string;
  };
  profile: {
    _id: string;
    first_name: string;
    last_name: string;
    birth_date: string; // ISO date string
    company_name: string;
    avatar: string; // probably a URL
  };
  positive_reasons: string[]; // e.g. ['professionalism']
  negative_reasons: string[]; // e.g. ['damaged_goods']
  comment: string;
  created_at: string; // ISO date string
  order: IOrder;
}

export interface ReviewItem {
  id: string;
  rating: number;
  phoneNumber: string;
  userId: string;
  fullName: string;
  comment: string;
  reasons: string[];
  orderId: string;
  orderName: string;
}

export enum ReasonsStatus {
  DAMAGED_GOODS = 'damaged_goods',
  INSUFFICIENT_QUANTITY = 'insufficient_quantity',
  HIGH_PRICE = 'high_price',
  LATE_DELIVERY = 'late_delivery',
  RUDE_STAFF = 'rude_staff',
  MEASUREMENT_ERROR = 'measurement_error',
  OTHER = 'other',
  PROFESSIONALISM = 'professionalism',
  AFFORDABLE_PRICE = 'affordable_price',
  DAMAGE_FREE_DELIVERY = 'damage_free_delivery',
  DELIVERY_SPEED = 'delivery_speed',
}

export const ReasonLabels: Record<ReasonsStatus, string> = {
  [ReasonsStatus.PROFESSIONALISM]: 'Professionalizm',
  [ReasonsStatus.AFFORDABLE_PRICE]: 'Hamyonbop narx',
  [ReasonsStatus.DAMAGE_FREE_DELIVERY]: 'Beshikast yetkazish',
  [ReasonsStatus.DELIVERY_SPEED]: 'Yetkazib berish tezligi',
  [ReasonsStatus.DAMAGED_GOODS]: 'Yuklar shikastlangan',
  [ReasonsStatus.INSUFFICIENT_QUANTITY]: 'Tovar soni kam',
  [ReasonsStatus.HIGH_PRICE]: 'Yuqori narx',
  [ReasonsStatus.LATE_DELIVERY]: 'Yuk o’z vaqtida yetkazib berilmadi',
  [ReasonsStatus.RUDE_STAFF]: "Qo'pol hodimlar",
  [ReasonsStatus.MEASUREMENT_ERROR]: "O'lchovdagi xatolik",
  [ReasonsStatus.OTHER]: 'Boshqa',
};
