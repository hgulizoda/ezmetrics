import { m } from 'framer-motion';
import { useCallback } from 'react';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { queryClient } from 'src/query';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ContactsPopover() {
  const popover = usePopover();

  const handleUpdateQuery = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
      popover.onOpen(e);
    },
    [popover]
  );
  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={popover.open ? 'inherit' : 'default'}
        onClick={handleUpdateQuery}
        sx={{
          ...(popover.open && {
            bgcolor: (theme) => theme.palette.action.selected,
          }),
        }}
      >
        <Iconify icon="solar:users-group-rounded-bold-duotone" width={24} />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 320 }}>
        <Typography variant="h6" sx={{ p: 1.5 }}>
          Adminlar{' '}
          {/* {isLoading ? 'Loading ...' : <Typography component="span">({data.length})</Typography>} */}
        </Typography>
        {/* <Scrollbar sx={{ height: 320 }}>
          {data
            .filter((el) => el._id !== decodedToken?.user)
            .sort()
            .map((contact, index) => (
              <MenuItem key={contact._id} sx={{ p: 1, display: 'flex', gap: 1 }}>
                <>
                  <Avatar alt={contact.first_name} src={_mock.image.avatar(index + 1)} />

                  <ListItemText
                    primary={`${contact.first_name} ${contact.last_name} ${contact.branch}`}
                    secondary={`So'ngi faollik  : ${convertToLocalTime(
                      contact.last_login_time as string
                    )}`}
                    primaryTypographyProps={{ typography: 'subtitle2' }}
                    secondaryTypographyProps={{
                      typography: 'caption',
                      color: 'text.secondary',
                      fontWeight: 'bold',
                    }}
                  />
                </>
                {contact._id === decodedToken?.user && (
                  <Iconify icon="mynaui:star-solid" color="#fcd53f" />
                )}
              </MenuItem>
            ))}
        </Scrollbar> */}
      </CustomPopover>
    </>
  );
}
