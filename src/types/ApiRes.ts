import { Pagination } from './pagination';

export interface IApiResponse<T> {
  data: T[];
  pagination: Pagination;
}
