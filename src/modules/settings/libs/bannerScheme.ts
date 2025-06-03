import * as yup from 'yup';

export const bannerScheme = yup.object().shape({
  image_url: yup.object({
    uz: yup.mixed().required(),
    ru: yup.mixed().required(),
  }),
});

export type BannerSchemeType = yup.InferType<typeof bannerScheme>;
