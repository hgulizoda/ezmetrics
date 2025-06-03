import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { IBanner } from '../../../types/banner';
import Iconify from '../../../../../components/iconify';
import { useDeleteBanner } from '../../../hooks/useBanner';

interface IProps extends IBanner {
  isOverlay?: boolean;
}

export const DNDItem = ({ id, image, isOverlay = false }: IProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });
  const { deleletBanner, isPending } = useDeleteBanner();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Box>
      <Box
        ref={setNodeRef}
        style={style}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f4f6f8',
          padding: '10px',
          borderRadius: '10px',
          opacity: isOverlay ? 0.5 : 1,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton {...attributes} {...listeners}>
            <Iconify icon="qlementine-icons:drag-16" />
          </IconButton>
          <Box width="200px" gap={1} display="flex" height="70px">
            <img
              loading="lazy"
              src={image.uz}
              alt="banner.uz"
              width="45%"
              height="100%"
              style={{ borderRadius: '10px', overflow: 'hidden' }}
            />
            <img
              loading="lazy"
              src={image.ru}
              alt="banner.ru"
              width="45%"
              height="100%"
              style={{ borderRadius: '10px', overflow: 'hidden' }}
            />
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            color="error"
            variant="contained"
            sx={{ minWidth: '30px', minHeight: '30px', p: 0 }}
            onClick={() => deleletBanner(id)}
            disabled={isPending}
          >
            <Iconify icon="hugeicons:delete-02" />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
