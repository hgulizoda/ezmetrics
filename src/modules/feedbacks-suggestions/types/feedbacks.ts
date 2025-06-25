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
}

export interface ReviewItem {
  id: string;
  rating: number;
  phoneNumber: string;
  userId: string;
  fullName: string;
  comment: string;
  positiveReasons: string[];
  negativeReasons: string[];
}

export enum PositiveReasonsStatus {
  PROFESSIONALISM = 'professionalism',
  AFFORDABLE_PRICE = 'affordable_price',
  DAMAGE_FREE_DELIVERY = 'damage_free_delivery',
  DELIVERY_SPEED = 'delivery_speed',
}

export enum NegativeReasonsStatus {
  DAMAGED_GOODS = 'damaged_goods',
  INSUFFICIENT_QUANTITY = 'insufficient_quantity',
  HIGH_PRICE = 'high_price',
  LATE_DELIVERY = 'late_delivery',
  RUDE_STAFF = 'rude_staff',
  MEASUREMENT_ERROR = 'measurement_error',
  OTHER = 'other',
}

export const PositiveReasonLabels: Record<PositiveReasonsStatus, string> = {
  [PositiveReasonsStatus.PROFESSIONALISM]: 'Professional yondashuv',
  [PositiveReasonsStatus.AFFORDABLE_PRICE]: 'Maʼqul narx',
  [PositiveReasonsStatus.DAMAGE_FREE_DELIVERY]: 'Shikast yetmagan yetkazib berish',
  [PositiveReasonsStatus.DELIVERY_SPEED]: 'Tez yetkazib berish',
};

export const NegativeReasonLabels: Record<NegativeReasonsStatus, string> = {
  [NegativeReasonsStatus.DAMAGED_GOODS]: 'Shikastlangan mahsulot',
  [NegativeReasonsStatus.INSUFFICIENT_QUANTITY]: 'Yetarli miqdorda emas',
  [NegativeReasonsStatus.HIGH_PRICE]: 'Narxi juda baland',
  [NegativeReasonsStatus.LATE_DELIVERY]: 'Yetkazib berish kechikdi',
  [NegativeReasonsStatus.RUDE_STAFF]: 'Xodimning qoʻpol munosabati',
  [NegativeReasonsStatus.MEASUREMENT_ERROR]: 'Oʻlchovdagi xatolik',
  [NegativeReasonsStatus.OTHER]: 'Boshqa',
};
