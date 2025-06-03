import { useTranslate } from 'src/locales';

export const useFormatDateHour = () => {
  const { t } = useTranslate('lang');

  return (isoDate: string) => {
    const monthNames = [
      t('month.jan'),
      t('month.feb'),
      t('month.mar'),
      t('month.apr'),
      t('month.may'),
      t('month.jun'),
      t('month.jul'),
      t('month.aug'),
      t('month.sep'),
      t('month.oct'),
      t('month.nov'),
      t('month.dec'),
    ];

    const date = new Date(isoDate);

    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];

    const year = date.getFullYear();
    const day = date.getDate();

    const hours = date.getHours().toString().padStart(2, '0'); // Ensures two-digit hours
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensures two-digit minutes

    return `${day}-${monthName}, ${year} / ${hours}:${minutes}`;
  };
};
