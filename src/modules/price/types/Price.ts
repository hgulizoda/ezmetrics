export interface IPriceList {
  weight_range: string;
  unit: string;
  price: number;
  dangerous_goods_price: number;
  price_with_customs: number;
  _id: string;
}

export interface IPriceRes {
  created_at: string;
  updated_at: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  description_cn: string;
  is_dangerous_goods: boolean;
  name_ru: string;
  name_uz: string;
  name_en: string;
  name_cn: string;
  pricing: IPriceList[];
  transport_type: string;
  with_customs_clearance: boolean;
  _id: string;
  kg_in_1m3: number;
  price_per_kg: number;
  documentation_price: number;
}

export interface IPriceListAdapter {
  weightRange: string;
  unit: string;
  price: number;
  dangerousGoodsPrice: number;
  priceWithCustoms: number;
}

export interface IPrice {
  createdAt: string;
  updatedAt: string;
  isDangerousGoods: boolean;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  descriptionCn: string;
  nameRu: string;
  nameUz: string;
  nameEn: string;
  nameCn: string;
  pricing: IPriceListAdapter[];
  transportType: string;
  withCustomsClearance: boolean;
  id: string;
  kgIn1M3: number;
  pricePerKg: number;
  documentationPrice: number;
}
