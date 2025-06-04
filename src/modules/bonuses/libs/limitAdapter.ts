import { ILimit } from '../types/Limit';

export const getLimitAdapter = (item?: ILimit) => ({
  _id: item?._id ?? '',
  volume_limit: item?.volume_limit ?? 0,
});
