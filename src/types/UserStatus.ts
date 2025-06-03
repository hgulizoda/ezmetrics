import { useTranslate } from 'src/locales';

import { LabelColor } from 'src/components/label';

export enum UserStatus {
  VERIFIED = 'verified',
  NOTVERIFIED = 'notverified',
}

export const useUserStatusLabels = () => {
  const { t } = useTranslate('lang');
  return {
    [UserStatus.VERIFIED]: t('userStatus.verified'),
    [UserStatus.NOTVERIFIED]: t('userStatus.notVerified'),
  };
};

export const UserStatusLabelsColor: Record<UserStatus, LabelColor> = {
  [UserStatus.VERIFIED]: 'success',
  [UserStatus.NOTVERIFIED]: 'error',
};
