import { ReviewItem, ReviewItemRes } from '../types/feedbacks';

export const feedbacksAdapter = (item: ReviewItemRes): ReviewItem => ({
  id: item._id ?? '',
  rating: item.rating ?? 0,
  phoneNumber: item.user?.phone_number ?? '',
  userId: item.user?.user_id ?? '',
  fullName: `${item.profile?.first_name} ${item.profile?.last_name}`,
  comment: item.comment ?? '',
  reasons: [...item.positive_reasons, ...item.negative_reasons],
  orderId: item.order._id ?? '',
  orderName: item.order.description ?? '',
});

export const feedbacksMapper = (data: ReviewItemRes[]) => data?.map(feedbacksAdapter) || [];
