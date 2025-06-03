import * as yup from 'yup';

export enum TruckType {
  LSJ = 'LSJ',
  FSJ = 'FSJ',
  ASJ = 'ASJ',
}

export enum ContainerType {
  AUTO = 'AUTO',
  HC40 = '40HC',
  GP40 = '40GP',
  HC20 = '20HC',
  GB20 = '20GP',
  HC45 = '45HC',
}

export const ContainerTypeLabels: Record<ContainerType, string> = {
  [ContainerType.AUTO]: 'Avto/Авто',
  [ContainerType.HC40]: '40HC',
  [ContainerType.GP40]: '40GP',
  [ContainerType.HC20]: '20HC',
  [ContainerType.GB20]: '20GP',
  [ContainerType.HC45]: '45HC',
};

export const truckScheme = yup.object({
  id: yup.string().required('Fura raqamini kiriting.').max(7, '7 ta raqamdan oshmasligi kerak'),
  type: yup.string().required('Truck type'),
  number: yup.string().min(5).required('Number'),
  created_at: yup.date().required(),
  estimated_arrival_date: yup.date().required(),
  container_number: yup.string().optional(),
});

export type TruckFormType = yup.InferType<typeof truckScheme>;
