export default function normalizeFileUrl(fileUrl?: string) {
  return fileUrl ? `${import.meta.env.VITE_BASE_URL}${fileUrl}` : '';
}
