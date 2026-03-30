import { useMutation } from '@tanstack/react-query';

import axiosInstance from '../../../utils/axios';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';

interface IDownloadFile {
  params?: Record<string, any>;
  name?: string;
}

const handleDownload = async ({ params, name }: IDownloadFile) => {
  const url = `${import.meta.env.VITE_BASE_URL}/api/orders/export`;
  try {
    const response = await axiosInstance.get(url, {
      responseType: 'blob',
      params,
    });

    if (response.status !== 200) {
      throw new Error('Fayl yuklab olinmadi');
    }

    const blob = response.data;
    const downloadFileName = name || url.split('/').pop() || 'download';

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = downloadFileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    showErrorSnackbar(error);
  }
};

export const useExcelDownload = ({ name, params }: IDownloadFile) => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => handleDownload({ name, params }),
  });

  return {
    isPending,
    download: mutateAsync,
  };
};
