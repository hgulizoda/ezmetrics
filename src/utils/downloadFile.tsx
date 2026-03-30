import { Box, Button } from '@mui/material';

import Iconify from 'src/components/iconify';

import axiosInstance from './axios';
import { showErrorSnackbar } from './showErrorSnackbar';

interface IDownloadFile {
  params: Record<string, any>;
  url: string;
  name?: string;
}

export const DownloadFile = ({ params, url, name }: IDownloadFile) => {
  const handleDownload = async () => {
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

  return (
    <Box>
      <Button
        color="primary"
        sx={{ height: '100%', gap: 1 }}
        variant="outlined"
        onClick={handleDownload}
      >
        <Iconify width={25} icon="material-symbols:download" />
        Excel
      </Button>
    </Box>
  );
};

export default DownloadFile;
