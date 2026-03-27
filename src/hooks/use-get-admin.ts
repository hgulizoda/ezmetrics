import { useQuery } from '@tanstack/react-query';

import { MOCK_ADMIN } from 'src/_mock/fake-backend';

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
  await new Promise((r) => setTimeout(r, 300));
  return { data: MOCK_ADMIN as IAdmin[] };
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
