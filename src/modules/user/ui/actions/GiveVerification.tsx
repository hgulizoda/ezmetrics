import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';

import { useUpdateUser, useUpdateUserMulti } from '../../hook/user';
import { ConfirmDialog } from '../../../../components/custome-dialog';

interface IProps {
  open: boolean;
  onClose: () => void;
  userId: { id: string; userId: string; isVerified: boolean };
  rowIDs: {
    status: string;
    id: string;
    userId: string;
  }[];
  status: string;
}

export const GiveVerification = ({ open, onClose, userId, rowIDs, status }: IProps) => {
  const { t } = useTranslate('lang');
  const { isPending, updateStatus } = useUpdateUser(userId);
  const { multiPendings, updateStatusMultiple } = useUpdateUserMulti(rowIDs);
  const onSubmit = async () => {
    if (rowIDs?.length) {
      await updateStatusMultiple(status);
    } else {
      await updateStatus(userId.isVerified ? 'unverify' : 'verify');
    }
    onClose();
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      action={
        <LoadingButton
          onClick={onSubmit}
          loading={isPending || multiPendings}
          variant="contained"
          color="primary"
        >
          {!rowIDs.length
            ? t(
                !userId.isVerified
                  ? 'users.actions.giveVerification'
                  : 'users.actions.takeVerification'
              )
            : t('actions.yes')}
        </LoadingButton>
      }
      title={
        rowIDs.length
          ? `${
              status === 'verify'
                ? t('users.confirm.firstContentVerify')
                : t('users.confirm.firstContentUnVerify')
            }`
          : `${t('users.confirm.titleSecond')}`
      }
      content={
        rowIDs.length
          ? `${
              status === 'verify'
                ? t('users.confirm.secondContentVerify')
                : t('users.confirm.secondContentUnVerify')
            }`
          : `${
              userId.isVerified
                ? t('users.confirm.secondContentUnVerify')
                : t('users.confirm.secondContentVerify')
            }`
      }
    />
  );
};
