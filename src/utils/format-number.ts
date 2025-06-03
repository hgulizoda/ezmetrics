import { useTranslate as getLocales } from 'src/locales/use-locales';

// ----------------------------------------------------------------------

/*
 * Locales code
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */

type InputValue = string | number | null;

function getLocaleCode() {
  const locales = getLocales();

  const currentLang = locales?.currentLang || { numberFormat: { code: 'en-US', currency: 'USD' } };

  return {
    code: currentLang.numberFormat?.code ?? 'en-US',
    currency: currentLang.numberFormat?.currency ?? 'USD',
  };
}

// ----------------------------------------------------------------------

export function fNumber(inputValue: InputValue) {
  const { code } = getLocaleCode();

  if (!inputValue) return 0;

  const number = Number(inputValue);

  const fm = new Intl.NumberFormat(code, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
  return fm;
}

export function formatLongNumber(number: number) {
  // Convert the number to a string and split it into integer and decimal parts.
  const [integerPart, decimalPart] = number.toString().split('.');

  // Format the integer part by iterating from right to left.
  let formattedInteger = '';
  let count = 0;
  let i = integerPart.length - 1;
  while (i >= 0) {
    formattedInteger = integerPart[i] + formattedInteger;
    count += 1;
    if (count % 3 === 0 && i !== 0) {
      formattedInteger = ` ${formattedInteger}`;
    }
    // Instead of i--, we subtract 1 explicitly.
    i -= 1;
  }

  // Combine the formatted integer part with the original decimal part (if it exists).
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

export function fCurrency(inputValue: InputValue) {
  const { code, currency } = getLocaleCode();

  if (!inputValue) return '';

  const number = Number(inputValue);

  const fm = new Intl.NumberFormat(code, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);

  return fm;
}

// ----------------------------------------------------------------------

export function fPercent(inputValue: InputValue) {
  const { code } = getLocaleCode();

  if (!inputValue) return '';

  const number = Number(inputValue) / 100;

  const fm = new Intl.NumberFormat(code, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(number);

  return fm;
}

// ----------------------------------------------------------------------

export function fShortenNumber(inputValue: InputValue) {
  const { code } = getLocaleCode();

  if (!inputValue) return '';

  const number = Number(inputValue);

  const fm = new Intl.NumberFormat(code, {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(number);

  return fm.replace(/[A-Z]/g, (match) => match.toLowerCase());
}

// ----------------------------------------------------------------------

export function fData(inputValue: InputValue) {
  if (!inputValue) return '';

  if (inputValue === 0) return '0 Bytes';

  const units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];

  const decimal = 2;

  const baseValue = 1024;

  const number = Number(inputValue);

  const index = Math.floor(Math.log(number) / Math.log(baseValue));

  const fm = `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`;

  return fm;
}
