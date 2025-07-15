import { useState } from 'react';
import { useParams } from 'react-router';

import { LoadingButton } from '@mui/lab';
import { DataGrid, gridClasses, GridPaginationModel } from '@mui/x-data-grid';
import { Card, Button, Dialog, Container, CardHeader, CardContent } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { TruckOrderDetail } from 'src/modules/settings/ui/truckDetails/TruckOrderDetail';

import { ConfirmDialog } from 'src/components/custome-dialog';
import Circular from 'src/components/loading-screen/circular-screen';

import { baseColumn } from './col';
import { useRestoreBall } from '../../services/useRestoreBall';
import { useGetRemovedBalls } from '../../services/useGetRemovedBalls';

export const RemovedBalls = () => {
  const [orderID, setOrderID] = useState<string>();
  const viewOrder = useBoolean();
  const [orderBallId, setOrderBallId] = useState<string>();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 100,
  });
  const openRestore = useBoolean();
  const params = useParams() as { id: string };
  const { data, isLoading } = useGetRemovedBalls({
    id: params.id,
    params: {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    },
  });
  const { isPending, mutateAsync } = useRestoreBall();
  if (isLoading) return <Circular />;
  return (
    <Container maxWidth="xl">
      <Card>
        <CardHeader title="Order ballarini ortga qaytarish" />
        <CardContent
          sx={{
            px: 0,
            ':last-child': { pb: 0 },
          }}
        >
          <DataGrid
            columns={baseColumn({
              onRestore(id) {
                setOrderBallId(id);
                openRestore.onTrue();
              },
              onView(id) {
                setOrderID(id);
                viewOrder.onTrue();
              },
            })}
            sx={{
              [`& .${gridClasses.cell}`]: {
                borderBottom: 'none',
              },
            }}
            rows={data?.orders}
            loading={isLoading}
            rowCount={data?.total_records || 0}
            getRowId={(row) => row._id || crypto.randomUUID()}
            onPaginationModelChange={setPaginationModel}
            initialState={{
              pagination: { paginationModel },
            }}
          />
        </CardContent>
      </Card>

      {orderBallId && (
        <ConfirmDialog
          open={openRestore.value}
          onClose={openRestore.onFalse}
          title="Ortga qaytarish"
          content="Order uchun berilgan ballni ortga qaytarish"
          action={
            <>
              <Button variant="outlined" color="inherit" onClick={openRestore.onFalse}>
                Bekor qilish
              </Button>
              <LoadingButton
                loading={isPending}
                onClick={async () => {
                  await mutateAsync(orderBallId);
                  openRestore.onFalse();
                }}
                variant="contained"
                color="primary"
              >
                Qaytarish
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
