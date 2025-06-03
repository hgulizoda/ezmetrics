import { IFilters } from '../types/Filters';
import axiosInstance from '../../../utils/axios';
import { IBonusesList } from '../types/BunusesList';
import { IApiResponse } from '../../../types/ApiRes';

export const bonusesAPI = {
  // get all list of  Bonuses
  getAll: (params: IFilters) =>
    axiosInstance
      .get<IApiResponse<IBonusesList[]>>('user-bonus/all', { params })
      .then((res) => res.data),
  // get one  Bonuse
  getOne: (id: string) => axiosInstance.get<IApiResponse<IBonusesList>>(`/bonuses/${id}`),
  updateStatus: (bonus_id: string, user_id: string) =>
    axiosInstance.post(`/user-bonus/use/${bonus_id}/${user_id}`),
};
