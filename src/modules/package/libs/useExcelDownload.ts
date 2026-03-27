import { useMutation } from '@tanstack/react-query';

interface IDownloadFile {
  params?: Record<string, any>;
  name?: string;
}

const handleDownload = async ({ params: _params, name }: IDownloadFile) => {
  // Mock download - generate a dummy CSV blob
  const csvContent = 'id,order_id,status,weight\n1,GM10001,pending,5.2\n2,GM10002,delivered,12.8\n';
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const downloadFileName = name || 'orders-export.csv';

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = downloadFileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
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
