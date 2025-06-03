import { TFunction } from 'i18next';

import { ChipProps } from '@mui/material';

import { BonusesStatus } from '../types/BunusesList';

export const statusLabel = (t: TFunction): Record<BonusesStatus, string> => ({
  [BonusesStatus.USED]: t('bonus.enum.used'),
  [BonusesStatus.NOT_USED]: t('bonus.enum.not_used'),
});

export const statusColor: Record<BonusesStatus, ChipProps['color']> = {
  [BonusesStatus.USED]: 'error',
  [BonusesStatus.NOT_USED]: 'success',
};
