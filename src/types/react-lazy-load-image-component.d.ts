// src/types/react-lazy-load-image-component.d.ts
declare module 'react-lazy-load-image-component' {
  import * as React from 'react';

  export interface LazyLoadImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    afterLoad?: () => void;
    delayTime?: number;
    threshold?: number;
    beforeLoad?: () => void;
    delayMethod?: 'debounce' | 'throttle' | string;
    placeholder?: React.ReactNode;
    placeholderSrc?: string;
    wrapperProps?: any;
    scrollPosition?: any;
    visibleByDefault?: boolean;
    effect?: string;
    useIntersectionObserver?: boolean;
    wrapperClassName?: string;
  }

  export const LazyLoadImage: React.FC<LazyLoadImageProps>;
  export default LazyLoadImage;
}
