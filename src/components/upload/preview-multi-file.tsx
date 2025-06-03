import { m, AnimatePresence } from 'framer-motion';

import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';

import Iconify from '../iconify';
import { varFade } from '../animate';
import { UploadProps } from './types';
import FileThumbnail, { fileData } from '../file-thumbnail';

// ----------------------------------------------------------------------

export default function MultiFilePreview({ thumbnail, files, onRemove, sx }: UploadProps) {
  return (
    <AnimatePresence initial={false}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: 2,
          gridAutoRows: 'auto',
        }}
      >
        {files?.map((file) => {
          const { key } = fileData(file);

          if (thumbnail) {
            return (
              <Stack
                key={key}
                component={m.div}
                {...varFade().inUp}
                alignItems="center"
                display="inline-flex"
                justifyContent="center"
                sx={{
                  m: 0.5,
                  width: 80,
                  height: 80,
                  borderRadius: 1.25,
                  overflow: 'hidden',
                  position: 'relative',
                  border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                  ...sx,
                }}
              >
                <FileThumbnail tooltip file={file} sx={{ position: 'absolute' }} />

                {onRemove && (
                  <IconButton
                    size="small"
                    onClick={() => onRemove(file)}
                    sx={{
                      p: 0.5,
                      top: 4,
                      right: 4,
                      position: 'absolute',
                      color: 'common.white',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      },
                    }}
                  >
                    <Iconify icon="mingcute:close-line" width={14} />
                  </IconButton>
                )}
              </Stack>
            );
          }

          return (
            <Stack
              key={key}
              component={m.div}
              {...varFade().inUp}
              spacing={2}
              direction="row"
              alignItems="center"
              sx={{
                borderRadius: 1,
                border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                ...sx,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <FileThumbnail tooltip file={file} sx={{ position: 'absolute' }} />

              {/* <ListItemText
                primary={isNotFormatFile ? file : name}
                secondary={isNotFormatFile ? '' : fData(size)}
                secondaryTypographyProps={{
                  component: 'span',
                  typography: 'caption',
                }}
              /> */}

              {onRemove && (
                <IconButton
                  size="small"
                  onClick={() => onRemove(file)}
                  sx={{
                    position: 'absolute',
                    zIndex: 10,
                    top: 5,
                    right: 5,
                    bgcolor: '#161c247a',
                  }}
                  color="default"
                >
                  <Iconify icon="mingcute:close-line" width={16} color="#fff" />
                </IconButton>
              )}
            </Stack>
          );
        })}
      </Box>
    </AnimatePresence>
  );
}
