import * as yup from 'yup';

interface IProps {
  weight: number;
  capacity: number;
  count: number;
  places: number;
}

export const separateScheme = (defaultValue: IProps) =>
  yup.object({
    weight: yup
      .number()
      .required('Weight is required')
      .test(
        'invalid-weight',
        `Yuk og'irligi 0 dan katta va ${defaultValue.weight} dan kichik bo'lishi kerak`,
        (value) => value > 0 && value !== defaultValue.weight && value < defaultValue.weight
      ),
    capacity: yup
      .number()
      .required('Capacity is required')
      .test(
        'invalid-capacity',
        `Yuk hajmi 0 dan katta va ${defaultValue.capacity} dan kichik bo'lishi kerak`,
        (value) => value > 0 && value !== defaultValue.weight && value < defaultValue.capacity
      ),
    count: yup
      .number()
      .required('Count is required')
      .test(
        'invalid-count',
        `Yuklar soni 0 dan katta va ${defaultValue.count} dan kichik bo'lishi kerak`,
        (value) => value > 0 && value !== defaultValue.weight && value < defaultValue.count
      ),
    places: yup
      .number()
      .required('Places are required')
      .test(
        'invalid-places',
        `Yuklar joyi 0 dan katta va ${defaultValue.places} dan kichik bo'lishi kerak`,
        (value) => value > 0 && value !== defaultValue.weight && value < defaultValue.places
      ),
  });

export type SeparateFormType = yup.InferType<ReturnType<typeof separateScheme>>;
