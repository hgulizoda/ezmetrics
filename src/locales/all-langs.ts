// date pickers (MUI)
import { enUS as enUSDate, ruRU as ruRUDate } from '@mui/x-date-pickers/locales';
// data grid (MUI)
import { enUS as enUSDataGrid, ruRU as ruRUDataGrid } from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  // {
  //   value: 'en',
  //   label: 'English',
  //   countryCode: 'GB',
  //   adapterLocale: 'en',
  //   numberFormat: { code: 'en-US', currency: 'USD' },
  //   systemValue: {
  //     components: { ...enUSDate.components, ...enUSDataGrid.components },
  //   },
  // },
  {
    value: 'ru',
    label: 'Русский',
    countryCode: 'RU',
    adapterLocale: 'ru',
    numberFormat: { code: 'ru-RU', currency: 'RUB' },
    systemValue: {
      components: { ...ruRUDate.components, ...ruRUDataGrid.components },
    },
  },
  {
    value: 'uz',
    label: "O'zbek",
    countryCode: 'UZ',
    adapterLocale: 'uz',
    numberFormat: { code: 'uz-UZ', currency: 'UZS' },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
  },
  // {
  //   value: 'cn',
  //   label: '简体中文',
  //   countryCode: 'CN',
  //   adapterLocale: 'zh-CN',
  //   numberFormat: { code: 'zh-CN', currency: 'CNY' },
  //   systemValue: {
  //     components: { ...zhCNDate.components, ...zhCNDataGrid.components },
  //   },
  // },
];
