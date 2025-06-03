import { TFunction } from 'i18next';

interface Props {
  isDangerous: boolean;
  isCustome: boolean;
  t: TFunction;
}

export const columns = ({ isDangerous, isCustome, t }: Props) =>
  [
    {
      id: 'ID',
      label: t('prices.formTable.auto.weight'),
      align: 'left',
    },
    {
      id: "O'lchov birligi",
      label: t('prices.formTable.auto.unit'),
      align: 'left',
    },
    {
      id: 'ending',
      label: t('prices.formTable.auto.price'),
      align: 'left',
    },
    isDangerous
      ? {
          id: 'status',
          label: t('prices.formTable.auto.isDangeroud'),
          align: 'left',
        }
      : null,
    isCustome
      ? {
          id: '',
          label: t('prices.formTable.auto.isCustoms'),
          align: 'left',
        }
      : null,
    {
      id: 'actions',
      label: '',
      align: 'right',
    },
  ].filter(Boolean);
