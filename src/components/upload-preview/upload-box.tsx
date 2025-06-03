import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';

import Iconify from '../iconify';
import type { UploadProps } from './types';

// ----------------------------------------------------------------------

export function UploadBox({ placeholder, error, disabled, sx, ...other }: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    ...other,
  });

  const hasError = isDragReject || error;

  return (
    <Box
      {...getRootProps()}
      sx={{
        width: 64,
        height: 64,
        flexShrink: 0,
        display: 'flex',
        borderRadius: 1,
        cursor: 'pointer',
        alignItems: 'center',
        color: 'text.disabled',
        justifyContent: 'center',
        bgcolor: (theme) => theme.palette.grey['300'],
        border: (theme) => `1px dashed ${theme.palette.grey['500']}`,
        ...(isDragActive && { opacity: 0.72 }),
        ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
        ...(hasError && {
          color: 'error.main',
          borderColor: 'error.main',
          bgcolor: (theme) => theme.palette.error.main,
        }),
        '&:hover': { opacity: 0.72 },
        ...sx,
      }}
    >
      <input {...getInputProps()} />

      {placeholder || <Iconify icon="eva:cloud-upload-fill" width={28} />}
    </Box>
  );
}
