import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
  Box,
  Card,
  Button,
  Dialog,
  Rating,
  Divider,
  Container,
  CardHeader,
  Typography,
  CardContent,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { TruckOrderDetail } from 'src/modules/settings/ui/truckDetails/TruckOrderDetail';

import Label from 'src/components/label';
import { ConfirmDialog } from 'src/components/custome-dialog';

import { feedcols } from './feedCol';
import { ReviewItem } from '../types/feedbacks';
import { useGetFeedbacks } from '../hooks/useGetFeedbacks';
import { useDeleteFeedback } from '../hooks/useDeleteFeedback';

export const Feedbacks = () => {
  const { t } = useTranslate('lang');
  const [feedbacksId, setFeedbacksId] = useState<string>('');
  const [orderID, setOrderID] = useState<string>('');
  const viewOrder = useBoolean();
  const { isPending, mutateAsync } = useDeleteFeedback(feedbacksId);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [feedbacks, setFeedbacks] = useState<ReviewItem>();
  const openView = useBoolean();
  const openDelete = useBoolean();
  const { data, isLoading } = useGetFeedbacks({
    params: {
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1,
    },
  });

  return (
    <Container maxWidth="xl">
      <Card>
        <CardHeader title={t('feedbacks.ratings')} />
        <CardContent
          sx={{
            px: 0,
            ':last-child': { pb: 0 },
          }}
        >
          <DataGrid
            sx={{
              [`& .${gridClasses.cell}`]: {
                borderBottom: 'none',
              },
            }}
            columns={feedcols({
              onDelete(id) {
                setFeedbacksId(id);
                openDelete.onTrue();
              },
              onView(item) {
                setFeedbacks(item);
                openView.onTrue();
              },
              orderView(id) {
                setOrderID(id);
                viewOrder.onTrue();
              },
              t,
            })}
            rows={data?.feedbacks || []}
            loading={isLoading}
            getRowId={(row) => row.id || crypto.randomUUID()}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            paginationModel={paginationModel}
            rowCount={data?.totalRecords ?? 0}
          />
        </CardContent>
      </Card>

      {feedbacks && (
        <Dialog open={openView.value} onClose={openView.onFalse} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h5">{feedbacks.fullName}</Typography>
            <Rating value={feedbacks.rating} />
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 2 }}>
            <Typography>{feedbacks.comment}</Typography>

            <Box my={2} gap={1} display="flex" flexWrap="wrap">
              {feedbacks.reasons.map((el) => (
                <Label key={el}>{t(`feedbacks.reasons.${el}`)}</Label>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={openView.onFalse}>
              {t('feedbacks.actions.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {feedbacksId && (
        <ConfirmDialog
          open={openDelete.value}
          onClose={openDelete.onFalse}
          title={t('feedbacks.deleteConfirm.title')}
          content={t('feedbacks.deleteConfirm.ratingContent')}
          action={
            <>
              <Button variant="outlined" color="inherit" onClick={openDelete.onFalse}>
                {t('actions.cancel')}
              </Button>
              <LoadingButton
                variant="contained"
                color="error"
                onClick={async () => {
                  await mutateAsync();
                  openDelete.onFalse();
                }}
                loading={isPending}
              >
                {t('actions.delete')}
              </LoadingButton>
            </>
          }
        />
      )}

      {orderID && (
        <Dialog
          open={viewOrder.value}
          onClose={viewOrder.onFalse}
          fullWidth
          maxWidth="md"
          scroll="body"
        >
          <TruckOrderDetail orderID={orderID} onClose={viewOrder.onFalse} />
        </Dialog>
      )}
    </Container>
  );
};
