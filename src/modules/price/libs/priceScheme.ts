import * as yup from 'yup';

const priceListSchema = yup.object().shape({
  weight_range: yup.string().required('Weight range is required'),
  unit: yup.string().required('Unit is required'),
  price: yup.number().min(0, 'Price must be non-negative').required('Price is required'),
  dangerous_goods_price: yup
    .number()
    .min(0, 'Dangerous goods price must be non-negative')
    .required('Dangerous goods price is required'),
  price_with_customs: yup
    .number()
    .min(0, 'Price with customs must be non-negative')
    .required('Price with customs is required'),
});

export const priceResSchema = yup.object().shape({
  description_uz: yup.string().required('Description is required'),
  description_ru: yup.string().required('Description is required'),
  description_en: yup.string().required('Description is required'),
  description_cn: yup.string().required('Description is required'),
  is_dangerous_goods: yup.boolean().optional(),
  name_ru: yup.string().required('Russian name is required'),
  name_uz: yup.string().required('Uzbek name is required'),
  name_en: yup.string().required('Uzbek name is required'),
  name_cn: yup.string().required('Uzbek name is required'),
  pricing: yup.array().of(priceListSchema).required('Pricing list is required'),
  transport_type: yup.string().required('Transport type is required'),
  with_customs_clearance: yup.boolean().optional(),
  kg_in_1m3: yup.number().optional(),
  price_per_kg: yup.number().optional(),
  documentation_price: yup.number().optional(),
});

export type PriceSchemeType = yup.InferType<typeof priceResSchema>;
