// ----------------------------------------------------------------------

export type LanguageValue = 'en' | 'uz' | 'ru' | 'cn';

export const fallbackLng = 'uz';
export const languages = ['en', 'uz', 'ru', 'cn'];
export const defaultNS = 'common';
export const cookieName = 'i18next';

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: languages,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages: Record<
  LanguageValue,
  { success: string; error: string; loading: string }
> = {
  en: {
    success: 'Language has been changed!',
    error: 'Error changing language!',
    loading: 'Loading...',
  },
  ru: {
    success: 'Язык изменен!',
    error: 'Ошибка изменения языка!',
    loading: 'Загрузка...',
  },
  uz: {
    success: "Til o'zgartirildi!",
    error: "Tilni o'zgartirishda xatolik yuz berdi!",
    loading: 'Yuklanmoqda...',
  },
  cn: {
    success: '语言已更改！',
    error: '更改语言时出错！',
    loading: '加载中...',
  },
};
