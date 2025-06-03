import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

interface IAdmin {
  branch: string;
  dob: string;
  father_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  _id: string;
}

const getAdminInfo = async () => {
  const response = await axiosInstance.get<{ data: IAdmin[] }>('admin/me');
  return response.data;
};

export const useGetAdminInfo = () => {
  const { isLoading, data, error } = useQuery({
    queryFn: getAdminInfo,
    queryKey: ['adminInfo'],
  });

  return {
    isLoading,
    data,
    error,
  };
};
