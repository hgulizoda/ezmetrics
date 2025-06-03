export interface IBannerPost {
  image_url: {
    uz: string;
    ru: string;
  };
}

export interface IBannerRes {
  _id: string;
  image_url: {
    uz: string;
    ru: string;
  };
  order: number;
}

export interface IBanner {
  id: string;
  image: {
    uz: string;
    ru: string;
  };
  order: number;
}
