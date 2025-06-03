import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';
import type { IconButtonProps } from '@mui/material/IconButton';

import { bgBlur } from 'src/theme/css';

import Iconify from '../iconify';

// ----------------------------------------------------------------------

export function DownloadButton({ sx, ...other }: ButtonBaseProps) {
  const theme = useTheme();

  return (
    <ButtonBase
      sx={{
        p: 0,
        top: 0,
        right: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        opacity: 0,
        position: 'absolute',
        color: 'common.white',
        borderRadius: 'inherit',
        transition: theme.transitions.create(['opacity']),
        '&:hover': {
          ...bgBlur({ color: theme.palette.grey['900'] }),
          opacity: 1,
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="eva:arrow-circle-down-fill" width={24} />
    </ButtonBase>
  );
}

// ----------------------------------------------------------------------

export function RemoveButton({ sx, ...other }: IconButtonProps) {
  return (
    <IconButton
      size="small"
      sx={{
        p: 0.35,
        top: 4,
        right: 4,
        position: 'absolute',
        color: 'common.white',
        bgcolor: (theme) => theme.palette.grey['900'],
        '&:hover': { bgcolor: (theme) => theme.palette.grey['900'] },
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="mingcute:close-line" width={12} />
    </IconButton>
  );
}
