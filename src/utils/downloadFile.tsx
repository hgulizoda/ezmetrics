import { Box, Button } from '@mui/material';

import Iconify from 'src/components/iconify';

interface IDownloadFile {
  params: Record<string, any>;
  url: string;
  name?: string;
}

export const DownloadFile = ({ params: _params, url: _url, name }: IDownloadFile) => {
  const handleDownload = async () => {
    // Mock download - generate a dummy CSV blob
    const csvContent = 'id,order_id,status,weight\n1,GM10001,pending,5.2\n2,GM10002,delivered,12.8\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const downloadFileName = name || 'export.csv';

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = downloadFileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
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
