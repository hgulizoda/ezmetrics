import { useTranslate } from 'src/locales';

export const useFormatDate = () => {
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

    return day && monthName && year ? `${day}-${monthName}, ${year}` : '--';
  };
};
