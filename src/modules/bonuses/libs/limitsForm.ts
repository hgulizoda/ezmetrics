import * as yup from 'yup';

export const limitSchema = yup.object().shape({
  volume_limit: yup.number().min(1),
});

export type LimitSchemaForm = yup.InferType<typeof limitSchema>;
