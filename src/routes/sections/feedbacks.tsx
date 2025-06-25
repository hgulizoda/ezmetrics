import { lazy } from 'react';

const FeedbacksRoot = lazy(() => import('../../pages/dashboard/feedbacks-suggestions/feedbacks'));
const SuggestionsRoot = lazy(
  () => import('../../pages/dashboard/feedbacks-suggestions/suggestions')
);
export const feedbacksRoutes = [
  {
    path: 'feedbacks',
    children: [
      {
        element: <FeedbacksRoot />,
        path: 'ratings',
      },
      {
        element: <SuggestionsRoot />,
        path: 'suggestions',
      },
    ],
  },
];
