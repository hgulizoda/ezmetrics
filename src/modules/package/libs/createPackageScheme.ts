import * as yup from 'yup';

import { PackagingType } from '../types/CreatePackageEnum';

export const createPackageScheme = yup.object().shape({
  user: yup.object({
    label: yup.string().required(),
    value: yup.string().required(),
  }),
  order_weight: yup.mixed().required(),
  total_count: yup.mixed().required(),
  total_places: yup.mixed().required(),
  order_capacity: yup.mixed().required(),
  description: yup.string().optional(),
  note: yup.string().optional(),
  images: yup.array().of(yup.mixed<string | File>()),
  isCustomsByUser: yup.boolean().optional(),
  packagingType: yup
    .mixed<PackagingType>()
    .oneOf(Object.values(PackagingType))
    .optional(),

});

export type CreatePackageFormType = yup.InferType<typeof createPackageScheme>;