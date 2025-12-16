import dayjs from 'dayjs';

// Custom Uzbek (Latin) locale for dayjs
const locale = {
  name: 'uz-latn',
  weekdays: 'Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba'.split('_'),
  weekdaysShort: 'Yak_Dush_Sesh_Chor_Pay_Jum_Shan'.split('_'),
  weekdaysMin: 'Ya_Du_Se_Cho_Pa_Ju_Sha'.split('_'),
  months: 'Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr'.split(
    '_'
  ),
  monthsShort: 'Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek'.split('_'),
  weekStart: 1,
  yearStart: 4,
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm',
  },
  relativeTime: {
    future: '%s ichida',
    past: '%s oldin',
    s: 'bir necha soniya',
    m: 'bir daqiqa',
    mm: '%d daqiqa',
    h: 'bir soat',
    hh: '%d soat',
    d: 'bir kun',
    dd: '%d kun',
    M: 'bir oy',
    MM: '%d oy',
    y: 'bir yil',
    yy: '%d yil',
  },
  ordinal: (n: number) => n,
  meridiem: (hour: number) => {
    if (hour < 12) return 'AM';
    return 'PM';
  },
};

dayjs.locale('uz-latn', locale);

export default locale;
