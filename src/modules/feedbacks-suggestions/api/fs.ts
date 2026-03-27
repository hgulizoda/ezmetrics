import { delay, paginated, MOCK_FEEDBACKS, MOCK_SUGGESTIONS } from 'src/_mock/fake-backend';

interface Props {
  params: {
    limit: number;
    page: number;
  };
}

export const suggestions = {
  getAll: async ({ params }: Props) => {
    await delay();
    return paginated(MOCK_SUGGESTIONS, params.page, params.limit);
  },
  delete: async (_id: string) => {
    await delay();
  },
};

export const feedbacks = {
  getAll: async ({ params }: Props) => {
    await delay();
    return paginated(MOCK_FEEDBACKS, params.page, params.limit);
  },
  delete: async (_id: string) => {
    await delay();
  },
};
