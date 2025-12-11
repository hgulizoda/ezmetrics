import { enqueueSnackbar } from 'notistack';

import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';
import type { Theme, SxProps } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from './iconify';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  sx?: SxProps<Theme>;
};

export function SignOutButton({ ...other }: Props) {
  const { t } = useTranslate('lang');
  const router = useRouter();
  const { logout } = useAuthContext();
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <Button fullWidth variant="soft" size="large" onClick={handleLogout} {...other}>
      {t('auth.logout')}
      <Iconify icon="material-symbols:logout-rounded" ml={1} />
    </Button>
  );
}
