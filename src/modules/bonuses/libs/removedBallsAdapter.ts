import { IRemovedBonuses, IRemovedBonusesRes } from '../types/RemovedBonuss';

export const removedBallsAdapter = (item: IRemovedBonusesRes): IRemovedBonuses => ({
  id: item._id ?? '',
  ball: item.given_ball ?? 0,
  orderName: item.order?.description ?? '',
});

export const removedBallsMapper = (data: IRemovedBonusesRes[]) =>
  data?.map(removedBallsAdapter) || [];
