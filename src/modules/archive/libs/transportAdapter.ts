import { Transport, TransportRes } from '../types/Transport';

const transport = (item: TransportRes): Transport => ({
  id: item._id ?? '',
  name: item.name ?? '',
});

export const transportsAdapter = (data: TransportRes[]) => data?.map(transport) || [];
