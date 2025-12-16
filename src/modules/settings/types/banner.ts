export interface IBannerPost {
  image_url: {
    uz: string;
    ru: string;
    en: string;
  };
}

export interface IBannerRes {
  _id: string;
  image_url: {
    uz: string;
    ru: string;
    en: string;
  };
  order: number;
}

export interface IBanner {
  id: string;
  image: {
    uz: string;
    ru: string;
    en: string;
  };
  order: number;
}
