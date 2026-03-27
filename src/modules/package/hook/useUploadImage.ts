import { useMutation } from '@tanstack/react-query';

const upload = async ({ file }: { file: File }) => {
  // Mock upload - return a fake URL after a short delay
  await new Promise((r) => setTimeout(r, 500));
  const fakeUrl = URL.createObjectURL(file);
  return { url: fakeUrl };
};

export const useUploadImage = () => {
  const { mutateAsync: uploadAsync, isPending } = useMutation({
    mutationFn: upload,
  });

  return { uploadAsync, isPending };
};
