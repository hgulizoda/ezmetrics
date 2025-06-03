import * as yup from 'yup';

export const sendTransitScheme = yup.object().shape({
  transit_zone: yup.string().optional(),
});

export type SendTransitType = yup.InferType<typeof sendTransitScheme>;
