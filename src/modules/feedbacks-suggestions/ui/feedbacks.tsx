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

import Label from 'src/components/label';
import { ConfirmDialog } from 'src/components/custome-dialog';

import { feedcols } from './feedCol';
import { useGetFeedbacks } from '../hooks/useGetFeedbacks';
import { useDeleteFeedback } from '../hooks/useDeleteFeedback';
import {
  ReviewItem,
  NegativeReasonLabels,
  PositiveReasonLabels,
  NegativeReasonsStatus,
  PositiveReasonsStatus,
} from '../types/feedbacks';

export const Feedbacks = () => {
  const [feedbacksId, setFeedbacksId] = useState<string>('');
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
        <CardHeader title="Reytinglar" />
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
            })}
            rows={data?.feedbacks || []}
            loading={isLoading}
            onPaginationModelChange={setPaginationModel}
            initialState={{
              pagination: { paginationModel },
            }}
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

            <Box my={2}>
              <Typography mb={1} variant="subtitle2">
                Yaxshi sabablar:
              </Typography>
              <Box display="flex" gap={0.5} flexWrap="wrap">
                {feedbacks.positiveReasons.length > 0
                  ? feedbacks.positiveReasons.map((el) => (
                      <Label color="success">
                        {PositiveReasonLabels[el as PositiveReasonsStatus]}
                      </Label>
                    ))
                  : "Yo'q"}
              </Box>
            </Box>
            <Box mt={2}>
              <Typography mb={1} variant="subtitle2">
                Yomon sabablar:
              </Typography>
              <Box display="flex" gap={0.5} flexWrap="wrap">
                {feedbacks.negativeReasons.length > 0
                  ? feedbacks.negativeReasons.map((el) => (
                      <Label color="error">
                        {NegativeReasonLabels[el as NegativeReasonsStatus]}
                      </Label>
                    ))
                  : "Yo'q"}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={openView.onFalse}>
              Yopish
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {feedbacksId && (
        <ConfirmDialog
          open={openDelete.value}
          onClose={openDelete.onFalse}
          title="O'chirish"
          content="O'chirilga reytingni ortga qaytarib bo'lmaydi !"
          action={
            <>
              <Button variant="outlined" color="inherit" onClick={openDelete.onFalse}>
                Bekor qilish
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
                O&apos;chirish
              </LoadingButton>
            </>
          }
        />
      )}
    </Container>
  );
};
