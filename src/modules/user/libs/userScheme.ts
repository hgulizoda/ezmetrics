import * as yup from 'yup';

export const userScheme = yup.object().shape({
  first_name: yup.string(),
  last_name: yup.string(),
  phone_number: yup.string(),
  company_name: yup.string(),
  birth_date: yup.mixed(),
  avatar: yup.string().optional(),
  user_id: yup
    .string()
    .min(7, "4 raqamdan oshmasligi va kam bo'lmasligi kerak")
    .max(7, "4 raqamdan oshmasligi va kam bo'lmasligi kerak"),
  isBonusEnabled: yup.boolean(),
});

export type UserFormType = yup.InferType<typeof userScheme>;
