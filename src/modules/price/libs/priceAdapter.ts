import { IPrice, IPriceRes } from '../types/Price';

export const priceTier = (item: IPriceRes): IPrice => ({
  createdAt: item.created_at ?? '',
  updatedAt: item.updated_at ?? '',
  descriptionUz: item.description_uz ?? '',
  descriptionRu: item.description_ru ?? '',
  descriptionEn: item.description_en ?? '',
  descriptionCn: item.description_cn ?? '',
  isDangerousGoods: item.is_dangerous_goods ?? false,
  withCustomsClearance: item.with_customs_clearance ?? false,
  nameRu: item.name_ru ?? '',
  nameUz: item.name_uz ?? '',
  nameEn: item.name_en ?? '',
  nameCn: item.name_cn ?? '',
  pricing:
    item.pricing.map((priceItem, index) => ({
      weightRange: priceItem.weight_range ?? '',
      unit: priceItem.unit ?? '',
      price: priceItem.price ?? 0,
      dangerousGoodsPrice: priceItem.dangerous_goods_price ?? 0,
      priceWithCustoms: priceItem.price_with_customs ?? 0,
    })) ?? [],
  transportType: item.transport_type ?? '',
  id: item._id ?? '',
  kgIn1M3: item.kg_in_1m3 ?? undefined,
  pricePerKg: item.price_per_kg ?? null,
  documentationPrice: item.documentation_price ?? null,
});

export const priceAdapter = (data: IPriceRes[]): IPrice[] => data?.map(priceTier) || [];
