import * as yup from 'yup';

export const airPriceScheme = yup.object().shape({
  description_uz: yup.string().required('Description is required'),
  description_ru: yup.string().required('Description is required'),
  description_en: yup.string().required('Description is required'),
  description_cn: yup.string().required('Description is required'),
  name_ru: yup.string().required('Russian name is required'),
  name_uz: yup.string().required('Uzbek name is required'),
  name_en: yup.string().required('Uzbek name is required'),
  name_cn: yup.string().required('Uzbek name is required'),
  transport_type: yup.string().required('Transport type is required'),
  kg_in_1m3: yup.number().required('Price is required'),
  price_per_kg: yup.number().required('Price is required'),
  documentation_price: yup.number().required('Price is required'),
});

export type AirPriceSchemeType = yup.InferType<typeof airPriceScheme>;
