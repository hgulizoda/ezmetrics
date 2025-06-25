export interface FeedbackItemRes {
  _id: string;
  type: 'suggestion' | 'complaint';
  description: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  user: {
    _id: string;
    phone_number: string;
    status: 'verified' | 'unverified' | string;
    user_id: string;
  };
  profile: {
    _id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    company_name: string;
  };
}

export interface FeedbackItem {
  id: string;
  type: string;
  description: string;
  fullName: string;
  phoneNumber: string;
  userId: string;
}

export enum SuggestionEnum {
  COMPLAINT = 'complaint',
  SUGGESTION = 'suggestion',
  OTHERS = 'other',
}

export const SuggestionEnumLabels: Record<SuggestionEnum, string> = {
  [SuggestionEnum.COMPLAINT]: 'Shikoyat',
  [SuggestionEnum.SUGGESTION]: 'Taklif',
  [SuggestionEnum.OTHERS]: 'Boshqa',
};
