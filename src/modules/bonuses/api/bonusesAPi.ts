import { IFilters } from '../types/Filters';
import { IUpdateLimit } from '../types/Limit';
import axiosInstance from '../../../utils/axios';
import { IBonusesList } from '../types/BunusesList';
import { IApiResponse } from '../../../types/ApiRes';

interface Props {
  id: string;
  params: {
    page: number;
    limit: number;
  };
}
export const bonusesAPI = {
  // get all list of  Bonuses
  getAll: (params: IFilters) =>
    axiosInstance
      .get<IApiResponse<IBonusesList[]>>('user-bonus/all', { params })
      .then((res) => res.data),
  // get user Bonuses

  getUserBonuses: (id: string) =>
    axiosInstance
      .get<IApiResponse<IBonusesList[]>>(`user-bonus/user_id/${id}`)
      .then((res) => res.data),
  // get one  Bonuse
  getOne: (id: string) => axiosInstance.get<IApiResponse<IBonusesList>>(`/bonuses/${id}`),
  updateStatus: (bonus_id: string, user_id: string) =>
    axiosInstance.post(`/user-bonus/use/${bonus_id}/${user_id}`),
  unUseBonus: (bonus_id: string, user_id: string) =>
    axiosInstance.post(`/user-bonus/unuse/${bonus_id}/${user_id}`),
  getLimit: () => axiosInstance.get('user-bonus/get-limit').then((res) => res.data),
  changeLimit: (limit: IUpdateLimit) => axiosInstance.post('user-bonus/change-limit', limit),
  getSingleUserBonus: ({ id, params }: Props) =>
    axiosInstance.get(`user-bonus/${id}/orders-bonus`, { params }).then((res) => res.data),
  removeOrderBall: (id: string) =>
    axiosInstance.post(`user-bonus/remove-for-order/${id}`).then((res) => res),
  getRemovedBalls: ({ id, params }: Props) =>
    axiosInstance.get(`user-bonus/${id}/removed-orders-bonus`, { params }).then((res) => res.data),
  restoreBall: (id: string) =>
    axiosInstance.post(`user-bonus/restore-for-order/${id}`).then((res) => res),
};
