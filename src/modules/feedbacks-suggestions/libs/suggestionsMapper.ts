import { FeedbackItem, FeedbackItemRes } from '../types/suggestions';

export const suggestionAdapter = (item: FeedbackItemRes): FeedbackItem => ({
  type: item.type ?? '',
  description: item.description ?? '',
  fullName: `${item.profile?.first_name} ${item.profile?.last_name}`,
  phoneNumber: item.user?.phone_number ?? '',
  userId: item.user?.user_id ?? '',
  id: item._id ?? '',
});

export const suggestionMapper = (data: FeedbackItemRes[]) => data?.map(suggestionAdapter) || [];
