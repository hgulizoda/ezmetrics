import dayjs from 'dayjs';
import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { toast } from 'src/components/snackbar';

import { allLangs } from './all-langs';
import type { LanguageValue } from './config-locales';
import { fallbackLng, changeLangMessages as messages } from './config-locales';

// ----------------------------------------------------------------------

export function useTranslate(ns?: string) {
  const { t, i18n } = useTranslation(ns);
  const fallback = useMemo(() => allLangs.filter((lang) => lang.value === fallbackLng)[0], []);

  const currentLang = useMemo(
    () => allLangs.find((lang) => lang.value === i18n.language),
    [i18n.language]
  );
  const onChangeLang = useCallback(
    async (newLang: LanguageValue) => {
      try {
        const langChangePromise = i18n.changeLanguage(newLang);

        const currentMessages = messages[newLang] || messages.en;

        toast.promise(langChangePromise, {
          loading: currentMessages.loading,
          success: () => currentMessages.success,
          error: currentMessages.error,
        });

        if (currentLang) {
          dayjs.locale(currentLang.adapterLocale);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [currentLang, i18n]
  );

  return {
    t,
    i18n,
    onChangeLang,
    currentLang: currentLang ?? fallback,
  };
}
