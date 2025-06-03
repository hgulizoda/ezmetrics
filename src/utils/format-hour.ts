export function convertToLocalTime(dateString: string, timeZone = 'Asia/Yekaterinburg') {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  });
}
