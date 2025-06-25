import { ReviewItem, ReviewItemRes } from '../types/feedbacks';

export const feedbacksAdapter = (item: ReviewItemRes): ReviewItem => ({
  id: item._id ?? '',
  rating: item.rating ?? 0,
  phoneNumber: item.user?.phone_number ?? '',
  userId: item.user?.user_id ?? '',
  fullName: `${item.profile?.first_name} ${item.profile?.last_name}`,
  comment: item.comment ?? '',
  positiveReasons: item.positive_reasons ?? [],
  negativeReasons: item.negative_reasons ?? [],
});

export const feedbacksMapper = (data: ReviewItemRes[]) => data?.map(feedbacksAdapter) || [];
