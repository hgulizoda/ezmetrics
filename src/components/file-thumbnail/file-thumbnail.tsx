import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Theme, SxProps } from '@mui/material/styles';

import DownloadButton from './download-button';
import { fileData, fileThumb, fileFormat } from './utils';

// ----------------------------------------------------------------------

type FileIconProps = {
  file: File | string;
  tooltip?: boolean;
  onDownload?: VoidFunction;
  sx?: SxProps<Theme>;
};

export default function FileThumbnail({ file, tooltip, onDownload, sx }: FileIconProps) {
  const { name = '', path = '', preview = '' } = fileData(file);
  const format = fileFormat(path || preview);
  const renderContent = (
    <Box
      component="img"
      src={fileThumb(format)}
      sx={{
        width: 32,
        height: 32,
        flexShrink: 0,
        ...sx,
      }}
    />
  );

  if (tooltip) {
    return (
      <Tooltip title={name}>
        <Stack
          flexShrink={0}
          component="span"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 1,
            height: 100,
          }}
        >
          {renderContent}
          {onDownload && <DownloadButton onDownload={onDownload} />}
        </Stack>
      </Tooltip>
    );
  }

  return (
    <>
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </>
  );
}
