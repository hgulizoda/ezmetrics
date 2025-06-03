import { Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import Iconify from '../iconify';
import { ConfirmDialogProps } from './types';

// ----------------------------------------------------------------------

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  ...other
}: ConfirmDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          svg: { ml: 1 },
          position: 'relative',
        }}
      >
        {title}
        <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
          <IconButton onClick={onClose}>
            <Iconify icon="mingcute:close-fill" />
          </IconButton>
        </Box>
      </DialogTitle>

      {content && (
        <DialogContent
          sx={{
            typography: 'body2',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            svg: { ml: 1 },
          }}
        >
          {content}
        </DialogContent>
      )}

      <DialogActions>{action}</DialogActions>
    </Dialog>
  );
}
