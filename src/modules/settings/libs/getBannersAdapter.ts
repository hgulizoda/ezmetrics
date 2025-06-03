import { IBanner, IBannerRes } from '../types/banner';

const getBanner = (item: IBannerRes): IBanner => ({
  id: item._id ?? '',
  image: {
    uz: item.image_url.uz ?? '',
    ru: item.image_url.ru ?? '',
  },
  order: item.order,
});

export const getBannerAdapter = (data: IBannerRes[]) => data?.map(getBanner) || [];
