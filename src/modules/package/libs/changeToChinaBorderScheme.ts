import * as yup from 'yup';

export const chinaBorderscheme = yup.object({
  status: yup.string().required(),
  truck: yup.string().required(),
});

export type ChinaBorderFormType = yup.InferType<typeof chinaBorderscheme>;
