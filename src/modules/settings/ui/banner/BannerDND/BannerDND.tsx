import { useState, useEffect } from 'react';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import {
  DndContext,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';

import { Box, Grid } from '@mui/material';

import { ErrorData } from 'src/components/error-data/error-data';

import { DNDItem } from './DNDItem';
import { IBanner } from '../../../types/banner';
import { useGetBanner, useReorderBanner } from '../../../hooks/useBanner';
import Circular from '../../../../../components/loading-screen/circular-screen';

export const BannerDND = () => {
  const { reorderBanner } = useReorderBanner();
  const { isLoading, error, images } = useGetBanner();

  const [activeId, setActiveId] = useState<UniqueIdentifier | string | null>(null);
  const [imageItem, setImageItem] = useState<IBanner[]>([]);

  useEffect(() => {
    if (images) {
      setImageItem(images);
    }
  }, [images]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImageItem((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    if (over && active.id) {
      await reorderBanner({ id: active.id as string, order: over?.data.current?.sortable.index });
    }
    setActiveId(null);
  };

  if (error) return <ErrorData />;
  if (isLoading) return <Circular />;

  return (
    <Box display="flex" flexDirection="column" gap={2} bgcolor="#fff" borderRadius={2}>
      <Box>
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <SortableContext items={imageItem}>
            <Grid container rowSpacing={1}>
              {imageItem?.map((el) => (
                <Grid item xs={12}>
                  <DNDItem {...el} key={el.id} />
                </Grid>
              ))}
            </Grid>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <DNDItem isOverlay {...imageItem.find((item) => item.id === activeId)!} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>
    </Box>
  );
};
