import * as Yup from 'yup';

export const createStoreSchema = Yup.object().shape({
  receiver: Yup.string().required('Receiver is required'),
  phone_number: Yup.string().required('Phone number is required'),
  recieving_date: Yup.string().required('Receiving date is required'),
  store_address: Yup.string().required('Store address is required'),
  wechat_id: Yup.string().required('WeChat ID is required'),
});

export type CreateStoreSchemaType = Yup.InferType<typeof createStoreSchema>;
