import * as yup from 'yup';

export const userSchemeRequried = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  phone_number: yup.string().required(),
  company_name: yup.string(),
  birth_date: yup.mixed().required(),
  avatar: yup.string().optional(),
});

export type UserFormTypeRequired = yup.InferType<typeof userSchemeRequried>;
