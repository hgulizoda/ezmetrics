import { ITruck, ITruckRes } from '../types/truck';

const getTrucks = (item: ITruckRes): ITruck => ({
  truckName: item?.name ?? '',
  id: item?._id ?? '',
  status: item?.status ?? '',
  createdAt: item?.created_at ?? '',
  estimatedArrivalDate: item?.estimated_arrival_date ?? '',
  containerNumber: item.container_number ?? '',
});

export const getTrucksAdapter = (data: ITruckRes[]) => data.map(getTrucks) || [];
