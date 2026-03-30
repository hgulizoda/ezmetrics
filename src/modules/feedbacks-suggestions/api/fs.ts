import axiosInstance from 'src/utils/axios';

interface Props {
  params: {
    limit: number;
    page: number;
  };
}

export const suggestions = {
  getAll: ({ params }: Props) =>
    axiosInstance.get('/complaint-suggestion', { params }).then((res) => res.data),
  delete: (id: string) => axiosInstance.delete(`/complaint-suggestion/${id}`).then(),
};

export const feedbacks = {
  getAll: ({ params }: Props) =>
    axiosInstance.get('/delivery-feedback', { params }).then((res) => res.data),
  delete: (id: string) => axiosInstance.delete(`/delivery-feedback/${id}`).then(),
};
