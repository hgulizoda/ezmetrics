import * as yup from 'yup';

const contentSchema = yup.object({
  uz: yup.string().required('Uzbek title is required'),
  ru: yup.string().required('Russian title is required'),
});

export const notificationScheme = yup.object({
  title: contentSchema.required('Title is required'),
  body: contentSchema.required('Body is required'),
  image: yup.object({
    uz: yup.mixed().optional(),
    ru: yup.mixed().optional(),
  }),
  type: yup.string().required('Type is required'),
});

export type NotificationFormType = yup.InferType<typeof notificationScheme>;
