export const handleDownload = async (fileUrl: string, fileName?: string) => {
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) throw new Error('Fayl yuklab olinmadi');

    const blob = await response.blob();

    const downloadFileName = fileName || fileUrl.split('/').pop() || 'download';

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = downloadFileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Fayl yuklab olishda xato yuz berdi:', error);
  }
};
