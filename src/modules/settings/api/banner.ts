import axiosInstance from '../../../utils/axios';
import { IBannerRes, IBannerPost } from '../types/banner';

export const banner = {
  create: (data: IBannerPost) => axiosInstance.post('banner', data).then((res) => res.data),
  get: () => axiosInstance.get<{ data: IBannerRes[] }>('/banner/admin').then((res) => res.data),
  reOrder: (data: { id: string; order: number }) =>
    axiosInstance
      .patch(`banner/${data.id}/order`, {
        order: data.order,
      })
      .then((res) => res.data),
  delete: (id: string) => axiosInstance.delete(`banner/${id}`).then((res) => res.data),
};
