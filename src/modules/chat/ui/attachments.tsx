import Box from '@mui/material/Box';
import { Grid, Link, useTheme } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { IMessageRes } from '../types/messages';

interface Props {
  messages?: IMessageRes[];
}

export default function ChatRoomAttachments({ messages }: Props) {
  const collapse = useBoolean(true);
  const theme = useTheme();
  const renderBtn = (
    <ListItemButton
      disabled={false}
      onClick={collapse.onToggle}
      sx={{
        pl: 2.5,
        pr: 1.5,
        height: 40,
        flexShrink: 0,
        flexGrow: 'unset',
        typography: 'overline',
        color: 'text.secondary',
        bgcolor: 'background.neutral',
      }}
    >
      <Box component="span" sx={{ flexGrow: 1 }}>
        Attachments
      </Box>
      <Iconify
        width={16}
        icon={
          (!collapse.value && 'eva:arrow-ios-forward-fill') ||
          (![].length && 'eva:arrow-ios-forward-fill') ||
          'eva:arrow-ios-downward-fill'
        }
      />
    </ListItemButton>
  );

  const renderContent = messages && (
    <Scrollbar sx={{ px: 1, py: 1 }}>
      <Grid container spacing={1}>
        {messages.map(
          (attachment) =>
            !attachment.is_deleted &&
            attachment.type !== 'text' &&
            attachment.type !== 'audio' &&
            attachment.type !== 'gif' && (
              <Grid item xs={12} md={3} key={attachment._id}>
                {attachment.type === 'image' && (
                  <Link href={attachment.content} target="_blank" rel="noopener">
                    <img
                      src={attachment.content}
                      alt="img"
                      height={65}
                      width="100%"
                      style={{
                        borderRadius: 10,
                        objectFit: 'cover',
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    />
                  </Link>
                )}

                {attachment.type === 'video' && (
                  <Box
                    component={Link}
                    href={attachment.content}
                    target="_blank"
                    color="inherit"
                    sx={{
                      borderRadius: '10px',
                      border: `1px solid ${theme.palette.divider}`,
                      height: 65,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: theme.palette.background.neutral,
                    }}
                  >
                    <Iconify icon="mingcute:video-fill" width={50} />
                  </Box>
                )}

                {attachment.type === 'file' && (
                  <Box
                    component={Link}
                    href={attachment.content}
                    target="_blank"
                    color="inherit"
                    sx={{
                      borderRadius: '10px',
                      border: `1px solid ${theme.palette.divider}`,
                      height: 65,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: theme.palette.background.neutral,
                    }}
                  >
                    <Iconify icon="solar:file-bold-duotone" width={50} />
                  </Box>
                )}
              </Grid>
            )
        )}
      </Grid>
    </Scrollbar>
  );

  return (
    <>
      {renderBtn}

      <Box
        sx={{
          overflow: 'hidden',
          height: collapse.value ? 1 : 0,
          transition: theme.transitions.create(['height'], {
            duration: theme.transitions.duration.shorter,
          }),
        }}
      >
        {renderContent}
      </Box>
    </>
  );
}
